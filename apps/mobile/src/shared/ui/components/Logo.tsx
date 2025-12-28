export const Logo = ({
    text,
    src,
    alt,
    className = "w-16 h-16 p-1 border border-gray-300 rounded-full",
    width,
    height,
}: {
    text?: string;
    src?: string;
    alt?: string;
    className?: string;
    width?: number;
    height?: number;
}) => {
    return (
        <div className={className}>
            <img
                src={src}
                alt={alt}
                className={`w-16 h-16 p-1 border border-gray-300 rounded-full ${className}`}
                width={width}
                height={height}
            />
            {text && <span className="text-base font-bold">{text}</span>}
        </div>
    );
};
