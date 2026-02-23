export const copyPlainText = async (text: string): Promise<boolean> => {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch (err) {
        console.error('Failed to copy text', err);
        return false;
    }
};

export const copyRichText = async (html: string, plainText: string): Promise<boolean> => {
    try {
        const htmlBlob = new Blob([html], { type: 'text/html' });
        const textBlob = new Blob([plainText], { type: 'text/plain' });

        const data = [
            new ClipboardItem({
                'text/html': htmlBlob,
                'text/plain': textBlob,
            }),
        ];

        await navigator.clipboard.write(data);
        return true;
    } catch (err) {
        console.error('Failed to copy rich text', err);
        // Fallback
        return copyPlainText(plainText);
    }
};

export const triggerPrint = () => {
    window.print();
};
