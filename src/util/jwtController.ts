import jwt from "jsonwebtoken";
class jwtController {
  static instance: jwtController | null = null;
  private constructor() {
    if (jwtController.instance == null) {
      jwtController.instance = this;
    } else {
      return jwtController.instance;
    }
  }
  public static getInstance() {
    var controller = new jwtController();
    return controller;
  }

  public generateToken(payload: object, expiresIn = "60d") {
    const secretKey: string = process.env.JWTSECRET as string;
    return jwt.sign(payload, secretKey, { expiresIn });
  }

  verifyToken(token: string): jwt.JwtPayload | string | null {
    const secretKey: string = process.env.JWTSECRET as string;
    try {
      return jwt.verify(token, secretKey);
    } catch (err) {
      console.error("Invalid Token:", err);
      return null;
    }
  }
}

export default jwtController;
