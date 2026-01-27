import NextImage, { type ImageProps } from "next/image";

export const ProductImageWrapper = (props: ImageProps) => {
	return (
		<div className="overflow-hidden rounded-2xl border border-black/5">
			<NextImage
				{...props}
				className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-[1.03]"
			/>
		</div>
	);
};
