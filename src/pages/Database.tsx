import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Folder } from "lucide-react";

interface FolderItem {
    name: string;
    isDirectory: boolean;
}


function DatabasePage() {
    const [folders, setFolders] = useState<FolderItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [type, setType] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFolders = async () => {
        try {
            const res = await axios.get(`http://127.0.0.1:5000/folders`);
            if(!res.data.name){
                setMessage(res.data.message)
            }
            setFolders(res.data);
        } catch (error) {
            console.error("Failed to fetch folders", error);
        } finally {
            setLoading(false);
        }
        };
    
        fetchFolders();
    });

    // const handleFolderClick = (folderType: string) => {
    //     setType(folderType);
    //     navigate(`/details?type=${type}`);
    // }


return (
    <div className="container mx-auto p-4">

    <p className="text-left text-5xl font-bold m-10 my-20">Database</p>

    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 min-[768px]:grid-cols-5 gap-6 m-10 my-14">
        {folders.length > 0 ? (
          folders.map((folder, index) => (
            <Link to={`/details/${folder.name}`}>
                <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-md border-2 border-dashed border-gray-300 hover:shadow-lg hover:border-blue-500 transition duration-300 cursor-pointer flex flex-col justify-center items-center h-62 w-62">
                    <Folder className="w-20 h-auto" />
                <h2 className="text-2xl font-semibold text-gray-700 text-center">{folder.name}</h2>
                </div>
            </Link>
            
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full text-xl">No folders available.</p>
        )}
      </div>
</div>
);
};


export {DatabasePage};