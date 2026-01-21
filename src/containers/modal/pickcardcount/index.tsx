import React from 'react'
import { UseDisclosureReturn } from '@/hooks/useDisclosure'
import { Dialog } from '@radix-ui/react-dialog';

export interface CardCountModalProps {
  next: (count: number) => void;
  selectCount: (count: number) => void;
}

export default function PickCardCount({ disclosure }: { disclosure: UseDisclosureReturn<CardCountModalProps> }) {
  return (
    <Dialog open={disclosure.state.isOpen} onOpenChange={disclosure.state.onClose}>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-80">
          <h2 className="text-xl font-semibold mb-4 text-center">เลือกจำนวนไพ่</h2>
          <div className="flex flex-col space-y-4">
            {[1, 2, 3, 4, 5, 6, 7].map((count) => (
              <button
                key={count}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={() => {
                  disclosure.data.selectCount(count);
                  disclosure.data.next(count);
                  disclosure.state.onClose();
                }}
              >
                {count} ใบ
              </button>
            ))}
          </div>
        </div>
      </div>
    </Dialog >
  )
}
