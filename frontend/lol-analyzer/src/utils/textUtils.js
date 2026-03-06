// Utility function to parse markdown-like bold syntax (**text**)
export const parseBoldText = (text) => {
    if (!text) return text;

    // Split text by ** markers and create React elements
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
            const boldText = part.slice(2, -2); // Remove the ** markers
            return <strong key={index}>{boldText}</strong>;
        }
        return part;
    });
};