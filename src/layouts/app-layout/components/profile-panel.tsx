import AnimatedPanel from "@/components/animated-panel";
import AvatarUpload from "./avatar-upload";
import ProfileForm from "./profile-form";

type ProfilePanelProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function ProfilePanel({
  open,
  onOpenChange,
}: ProfilePanelProps) {
  return (
    <AnimatedPanel open={open} onOpenChange={onOpenChange} label="Profile">
      <div className="mb-6">
        <h2 className="text-lg font-semibold">Profile</h2>
        <p className="text-sm text-muted-foreground">
          Update your photo and name.
        </p>
      </div>
      <div className="flex flex-col gap-6">
        <AvatarUpload />
        <ProfileForm onSaved={() => onOpenChange(false)} />
      </div>
    </AnimatedPanel>
  );
}
