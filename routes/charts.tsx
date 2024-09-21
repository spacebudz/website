import { Charts } from "@/islands/charts.tsx";

export default function ChartsPage() {
    return (
        <div className="w-sreen h-screen flex items-center justify-center">
            <div className="w-full p-8 my-8 mx-32 border rounded">
                <Charts />
            </div>
        </div>
    );
}
