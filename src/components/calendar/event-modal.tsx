import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import moment from "moment";
import Link from "next/link";
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
      : event.category.name;

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
          <Link
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-400 text-base font-medium transition duration-150 ease-in hover:opacity-70"
          >
            {value}
          </Link>
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
  const multipleDays =
    moment.duration(moment(event.end).diff(moment(event.start))).asDays() > 1;

  const eventDate =
    type === "calendar"
      ? multipleDays
        ? `${moment(event.start).format("D MMM YYYY")} - ${moment(event.end).format("D MMM YYYY")}`
        : `${moment(event.start).format("D MMM YYYY")}`
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
    <Transition appear show={inspectEvent} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => setInspectEvent(false)}
      >
        <TransitionChild
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="bg-dark/5 fixed inset-0 backdrop-blur-sm" />
        </TransitionChild>
        <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <DialogPanel className="bg-muted/65 relative max-w-lg flex-1 space-y-4 rounded-2xl border border-black/10 p-6 shadow-xl focus:outline-0">
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
                {(event.building && event.room) ||
                  (event.place && (
                    <ModalItem
                      icon="location_on"
                      label="Local"
                      value={eventLocation}
                    />
                  ))}
                {type === "calendar" && event.link && (
                  <ModalItem
                    icon="explore"
                    label="Website"
                    value={event.link}
                    href={event.link}
                  />
                )}
                {type === "schedule" && event.professor && (
                  <ModalItem
                    icon="person"
                    label="Professor"
                    value={event.professor}
                  />
                )}
                {type == "schedule" && event.status == "override" && (
                  <div className="text-dark/90 mt-3 inline-flex items-center gap-2 self-center">
                    <span className="material-symbols-outlined text-lg">
                      gpp_maybe
                    </span>
                    <p className="text-sm font-light">
                      This is a custom shift and does not reflect your official
                      schedule.
                    </p>
                  </div>
                )}
              </div>
            </DialogPanel>
          </TransitionChild>
        </div>
      </Dialog>
    </Transition>
  );
}
