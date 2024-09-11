import { Charts } from "@/islands/charts.tsx";

export default function ChartsPage() {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="p-16 border-2 rounded-lg">
                <Charts />
            </div>
        </div>
    );
}
