// … other imports …
import { usePhoto } from "@/context/PhotoContext";

export default function Aluno() {
  // … existing hooks …
  const { photoUrl } = usePhoto();

  // inside DesktopSidebar JSX replace the <img> for student:
  const DesktopSidebar = (
    <aside className={/* … */}>
      <div className="p-4 flex flex-col items-center space-y-4">
        {logoUrl && (
          <img src={logoUrl} alt="Logo" className="w-12 h-12 object-contain" />
        )}
        <img
          src={photoUrl || "/placeholder.svg"}
          alt="Foto do aluno"
          className="w-16 h-16 rounded-full border-2 border-green-500"
        />
      </div>
      {/* … rest unchanged … */}
    </aside>
  );
  // … rest unchanged …
}