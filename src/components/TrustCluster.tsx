'use client';

export default function TrustCluster() {
  return (
    <div className="w-full flex flex-col items-center gap-3 text-center">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className="text-xs px-2 py-1 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200">Secure • SSL</span>
        <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200">Verified Agents</span>
        <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-700 border border-amber-200">Clear Policies</span>
      </div>
      <p className="text-xs text-gray-500">Protected data • Transparent terms • Prompt support</p>
    </div>
  );
}


