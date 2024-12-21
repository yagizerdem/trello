import { eventHandler } from "vinxi/http";
import jwt from "jsonwebtoken";
import { User } from "./entity/user";
const secretKey = process.env["JWTSECRET"] as string; // Replace with your secret key

class DynamicUser {
  public peerId: number;
  public peer: any;
  public userId: number;
  public targetUserId: number;
}

class DynamicStore {
  private static instance: DynamicStore | null = null;
  private store: Array<DynamicUser> | null = null;
  private constructor() {
    if (DynamicStore.instance) return DynamicStore.instance;
    this.store = [];
    DynamicStore.instance = this;
  }
  public static getInstance() {
    if (!DynamicStore.instance) new DynamicStore();
    return DynamicStore.instance;
  }
  public addDynamicUser(dynamicUser: DynamicUser) {
    this.store?.push(dynamicUser);
  }
  public removeDynamicUser(dynamicUser: DynamicUser) {
    if (this.store) {
      this.store = this.store?.filter(
        (item) => item != dynamicUser
      ) as Array<DynamicUser>;
    }
  }
  public removeByUserId(userId: number) {
    if (this.store) {
      this.store = this.store?.filter(
        (item: DynamicUser) => item.userId != userId
      ) as Array<DynamicUser>;
    }
  }
  public removeByPeerId(peerId: number) {
    if (this.store) {
      this.store = this.store?.filter(
        (item: DynamicUser) => item.peerId != peerId
      ) as Array<DynamicUser>;
    }
  }
  getDynamicUserByUserId(userId: number) {
    if (this.store) {
      for (var data of this.store) {
        if (data.userId == userId) {
          return data;
        }
      }
    }
    return null;
  }
  getDynamicUserByPeerId(peerId: number) {
    if (this.store) {
      for (var data of this.store) {
        if (data.peerId == peerId) {
          return data;
        }
      }
    }
    return null;
  }
  getStore(): Array<DynamicUser> | null {
    return this.store;
  }
  getUsersByTargetUserId(targetUserId: number): Array<DynamicUser> {
    if (this.store == null || !targetUserId) return [];
    const arr: Array<DynamicUser> = [];
    // get users in current chat contact
    for (var duser of this.store) {
      if (duser.targetUserId == targetUserId) {
        arr.push(duser);
      }
    }
    return arr;
  }
}

export default eventHandler({
  handler(event) {
    console.log("event hanlder girdi", event);
    return "hit";
  },
  websocket: {
    async open(peer) {
      console.log("open", peer.id, peer.url);
    },
    async message(peer, msg) {
      const message = JSON.parse(msg.text());
      if (String(message.type) == "auth") {
        try {
          const decoded: User = jwt.verify(message.token, secretKey) as User;
          // settin up store
          const newDynamicUser = new DynamicUser();
          newDynamicUser.peer = peer;
          newDynamicUser.peerId = Number(peer.id);
          newDynamicUser.userId = Number(decoded.id);
          DynamicStore.getInstance()?.addDynamicUser(newDynamicUser);
          //

          // handle active states
          // hanlde active states
          const arr: Array<DynamicUser> | undefined =
            DynamicStore.getInstance()?.getUsersByTargetUserId(
              Number(newDynamicUser.userId)
            );
          if (arr) {
            for (var duser of arr) {
              duser.peer.send(JSON.stringify({ type: "targetconnected" }));
            }
          }
        } catch (err) {
          console.log(err);
          //@ts-ignore
          peer.unsubscribe();
        }
      }
      if (String(message.type) == "isprofileactive") {
        const flag = DynamicStore.getInstance()?.getDynamicUserByUserId(
          Number(message.userid)
        )
          ? true
          : false;

        peer.send(JSON.stringify({ type: "isprofileactive", flag: flag }));
      }
      if (String(message.type) == "settargetprofile") {
        const dynamicUser: DynamicUser | undefined | null =
          DynamicStore.getInstance()?.getDynamicUserByPeerId(Number(peer.id));
        if (dynamicUser) {
          dynamicUser.targetUserId = message.userid;
        }
      }
      if (String(message.type) == "newmessage") {
        const newMessage = message.message.trim();
        if (newMessage == 0) return;

        const sender: DynamicUser | null | undefined =
          DynamicStore.getInstance()?.getDynamicUserByPeerId(Number(peer.id));
        if (!sender) return;

        const reciever: DynamicUser | null | undefined =
          DynamicStore.getInstance()?.getDynamicUserByUserId(
            Number(sender.targetUserId)
          );

        // send messages to both clients
        if (sender) {
          sender.peer.send(
            JSON.stringify({ type: "newmessage", message: newMessage })
          );
        }
        if (reciever?.targetUserId != sender.userId) return;
        if (reciever) {
          reciever.peer.send(
            JSON.stringify({ type: "newmessage", message: newMessage })
          );
        }
        //
      }
      if (String(message.type) == "iswriting") {
        const flag = message.flag;

        const curUser: DynamicUser | null | undefined =
          DynamicStore.getInstance()?.getDynamicUserByPeerId(Number(peer.id));
        if (!curUser) return;

        const destUserId: number = curUser.targetUserId;

        const destUser = DynamicStore.getInstance()?.getDynamicUserByUserId(
          Number(destUserId)
        );

        if (destUser && destUser.targetUserId == curUser.userId) {
          destUser.peer.send(JSON.stringify({ type: "iswriting", flag: flag }));
        }

        console.log("iswriting", flag);
      }
    },
    async close(peer, details) {
      const user = DynamicStore.getInstance()?.getDynamicUserByPeerId(
        Number(peer.id)
      );
      DynamicStore.getInstance()?.removeByPeerId(Number(peer.id));

      // hanlde active states
      const arr: Array<DynamicUser> | undefined =
        DynamicStore.getInstance()?.getUsersByTargetUserId(
          Number(user?.userId)
        );
      if (arr) {
        for (var duser of arr) {
          duser.peer.send(JSON.stringify({ type: "targetdisconnected" }));
        }
      }
    },
    async error(peer, error) {
      console.log("error", peer.id, peer.url, error);
    },
  },
});
