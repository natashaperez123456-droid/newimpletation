import { UserIcon } from "lucide-react";
import { LinkWithChannel } from "@/ui/atoms/LinkWithChannel";

export async function UserMenuContainer() {
	// Ya no hay lógica de fetch de usuario de Saleor.
	// Mostramos un icono de usuario simple que no lleva a ninguna parte por ahora.
	// Podría en el futuro llevar a una página de login/registro si la implementas.
	return (
		<div className="h-6 w-6 flex-shrink-0">
			<UserIcon className="h-6 w-6 shrink-0 text-neutral-500" aria-hidden="true" />
			<span className="sr-only">User menu</span>
		</div>
	);
}
