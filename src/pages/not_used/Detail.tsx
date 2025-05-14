import { useEffect, useState } from "react";
import axios from "axios";

interface FolderItem {
    name: string;
    isDirectory: boolean;
}

function DetailPage({ type }: { type: string }) {
const [items, setItems] = useState<FolderItem[]>([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
    const fetchFolders = async () => {
    try {
        const res = await axios.get(`http://127.0.0.1:5000/files`, {
        params: { type },
        });
        setItems(res.data);
    } catch (error) {
        console.error("Failed to fetch folders", error);
    } finally {
        setLoading(false);
    }
    };

    fetchFolders();
}, [type]);

return (
    <div className="p-6 max-w-2xl mx-auto">
    <h2 className="text-2xl font-bold mb-4">Contents of "{type}" Folder</h2>

    {loading ? (
        <p className="text-gray-600">Loading...</p>
    ) : items.length === 0 ? (
        <p className="text-gray-500">No files found.</p>
    ) : (
        <ul className="space-y-2">
        {items.map((item) => (
            <li key={item.name}>
            {item.isDirectory ? (
              <span>{item.name} (folder)</span>
            ) : (
              <img
                src={`http://127.0.0.1:5000/uploads/images/${type}/${item.name}`}
                alt={item.name}
                className="w-48 h-48 object-cover rounded"
              />
            )}
          </li>
        ))}
        </ul>
    )}
    </div>
);
};

export default DetailPage;