import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import moment from "moment";
import { Fragment } from "react";
import { Event } from "react-big-calendar";

interface IModalCommonProps {
  selectedEvent: Event;
  setInspectEvent: (arg: boolean) => void;
  type: "calendar" | "schedule";
}

interface IEventModalProps extends IModalCommonProps {
  inspectEvent: boolean;
}

interface IModalItemProps {
  icon: string;
  label: string;
  value: string;
  href?: string;
}

function ModalHeader({
  selectedEvent,
  setInspectEvent,
  type,
}: IModalCommonProps) {
  const event = selectedEvent.resource;
  const title = type === "schedule" ? event.courseName : event.title;
  const subtitle =
    type === "schedule"
      ? `Turno ${event.shiftType}${event.shiftNumber}`
      : event.place;

  return (
    <div className="pb-1">
      <div className="flex items-center justify-between">
        <DialogTitle className="text-dark text-2xl font-semibold">
          {title}
        </DialogTitle>
        <button
          className="material-symbols-outlined text-dark/50 cursor-pointer text-2xl transition-opacity ease-in-out hover:opacity-70"
          onClick={() => setInspectEvent(false)}
        >
          close
        </button>
      </div>

      <p className="text-xl">{subtitle}</p>
      {type === "schedule" && (
        <p>{`${event.year}º Ano, ${event.semester}º Semestre`}</p>
      )}
    </div>
  );
}

function ModalItem({ icon, label, value, href }: IModalItemProps) {
  return (
    <div className="inline-flex items-center gap-4 pb-3.5">
      <span
        className="material-symbols-outlined text-dark text"
        style={{ fontSize: "28px" }}
      >
        {icon}
      </span>
      <div className="flex flex-col gap-1">
        <label className="text-dark/50 text-sm">{label}</label>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-400 text-base font-medium transition duration-150 ease-in hover:opacity-70"
          >
            {value}
          </a>
        ) : (
          <p className="text-dark text-base font-medium">{value}</p>
        )}
      </div>
    </div>
  );
}

export default function EventModal({
  selectedEvent,
  setInspectEvent,
  inspectEvent,
  type,
}: IEventModalProps) {
  const event = selectedEvent.resource;
  const eventDate =
    type === "calendar"
      ? `${moment(event.start).format("D MMM YYYY")} - ${moment(event.end).format("D MMM YYYY")}`
      : "";
  const eventTime =
    type === "schedule"
      ? `${event.start} - ${event.end}`
      : `${moment(event.start).format("HH:mm")} - ${moment(event.end).format("HH:mm")}`;
  const eventLocation =
    type === "schedule"
      ? `${event.building} - Sala ${event.room}`
      : event.place;

  return (
    <Transition
      show={inspectEvent}
      enter="transition duration-100 ease-out"
      enterFrom="transform scale-95 opacity-0"
      enterTo="transform scale-100 opacity-100"
      leave="transition duration-75 ease-out"
      leaveFrom="transform scale-100 opacity-100"
      leaveTo="transform scale-95 opacity-0"
      as={Fragment}
    >
      <Dialog
        onClose={() => setInspectEvent(false)}
        transition
        className="bg-dark/5 fixed inset-0 z-[100] flex w-screen items-center justify-center p-4 backdrop-blur-sm transition duration-300 ease-out data-closed:opacity-0"
      >
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <DialogPanel
            className={`bg-muted/50 relative max-w-lg flex-1 space-y-4 rounded-2xl border border-black/10 p-6 shadow-xl`}
          >
            <ModalHeader
              selectedEvent={selectedEvent}
              setInspectEvent={setInspectEvent}
              type={type}
            />

            <div className="divide-dark/10 flex flex-col gap-3 divide-y">
              {type === "calendar" && (
                <ModalItem
                  icon="calendar_today"
                  label="Data"
                  value={eventDate}
                />
              )}
              <ModalItem icon="schedule" label="Hora" value={eventTime} />
              <ModalItem
                icon="location_on"
                label="Local"
                value={eventLocation}
              />
              {type === "calendar" && event.link && (
                <ModalItem
                  icon="explore"
                  label="Website"
                  value={event.link.label}
                  href={event.link.href}
                />
              )}
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
}
