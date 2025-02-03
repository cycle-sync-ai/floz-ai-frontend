// Generated with Ion on 10/26/2023, 8:14:49 PM
// Figma Link: https://www.figma.com/file/Mck0YOlOESXRW2sjvamXQa?node-id=106:13995
type OauthButtonProps = {
  platform?: "Google";
  onClick?: () => void;
};

function OauthButton({ platform = "Google", onClick }: OauthButtonProps) {
  const platformToImage = {
    Google: "/google-logo.png",
  };

  return (
    <button
      className="flex w-full items-center justify-center gap-3 rounded-lg shadow-lg border border-neutral-200 bg-white px-4 py-3 hover:bg-[#6B6B6B] hover:bg-opacity-20"
      onClick={onClick}
    >
      <img src={platformToImage[platform]} alt="Vector" className="h-4 w-4" />
      {`Sign in with ${platform}`}
    </button>
  );
}
export default OauthButton;
