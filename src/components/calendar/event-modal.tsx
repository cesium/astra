import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { Event } from "react-big-calendar";

interface IEventModalProps {
  selectedEvent: Event;
  setInspectEvent: (arg: boolean) => void;
  inspectEvent: boolean;
  type: "calendar" | "schedule";
}

function ModalItem() {
  return (
    <div className="inline-flex items-center gap-4 pb-3.5">
      <span
        className="material-symbols-outlined text-dark"
        style={{ fontSize: "28px" }}
      >
        calendar_today
      </span>
      <div className="flex flex-col gap-1">
        <label className="text-dark/50 text-sm">Data</label>
        <p className="text-dark text-base font-medium">01/12</p>
      </div>
    </div>
  );
}

export default function EventModal({
  selectedEvent,
  setInspectEvent,
  inspectEvent,
}: IEventModalProps) {
  return (
    <Dialog
      open={inspectEvent}
      onClose={() => setInspectEvent(false)}
      transition
      className="fixed inset-0 z-50 flex w-screen items-center justify-center bg-black/50 p-4 transition duration-300 ease-out data-closed:opacity-0"
    >
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <DialogPanel
          className={`relative max-w-xs flex-1 space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-xl`}
        >
          <div className="flex items-center justify-between pb-2">
            <DialogTitle className="text-lg font-semibold text-gray-900">
              {selectedEvent.title}
            </DialogTitle>
            <button
              className="material-symbols-outlined cursor-pointer transition-opacity ease-in-out hover:opacity-65"
              style={{ fontSize: "22px" }}
              onClick={() => setInspectEvent(false)}
            >
              close
            </button>
          </div>

          <div className="divide-dark/10 flex flex-col gap-3 divide-y">
            <ModalItem />
            <ModalItem />
            <ModalItem />
            <ModalItem />
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
