'use client';

import { emitPageSnapshotNow } from '@/app/components/PageSnapshotEmitter';

export default function HomeSnapshotButton() {
  return (
    <button
      onClick={() => emitPageSnapshotNow({
        page: 'home',
        title: 'Home — Lumina Estate',
        summary: 'მიმდინარე მდგომარეობა მთავარ გვერდზე'
      })}
      className="text-sm h-8 px-3 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
    >
      ამ გვერდის აღწერა
    </button>
  );
}


