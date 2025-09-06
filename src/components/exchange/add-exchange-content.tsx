import { useState } from "react";
import ExchangeListbox from "./utils/listbox";

const ucs = [
  { id: "uc1", name: "Álgebra Linear" },
  { id: "uc2", name: "Cálculo" },
  { id: "uc3", name: "Tópicos de Matemática Discreta" },
  { id: "uc4", name: "Geometria Analítica" },
];

const shifts = [
  { id: "turno1", name: "Teórico" },
  { id: "turno2", name: "Teórico-Prático" },
];

const myShifts = [
  { id: "1", name: "TP1" },
  { id: "2", name: "TP2" },
  { id: "3", name: "TP3" },
  { id: "4", name: "TP4" },
  { id: "5", name: "TP5" },
  { id: "6", name: "TP6" },
];

const availableShifts = [
  { id: "1", name: "TP1" },
  { id: "2", name: "TP2" },
  { id: "3", name: "TP3" },
  { id: "4", name: "TP4" },
  { id: "5", name: "TP5" },
];

export default function AddExchangeContent() {
  const [selectedUC, setSelectedUC] = useState(ucs[0].id);
  const [selectedShift, setSelectedShift] = useState(shifts[0].id);
  const [selectedAvailableShifts, setSelectedAvailableShifts] = useState(
    availableShifts[0].id,
  );
  const [selectedMyShifts, setSelectedMyShifts] = useState(myShifts[0].id);

  return (
    <div className="flex flex-col gap-4">
      <form action="" className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="px-2 py-1 text-sm font-semibold">
            Select the curricular unit
          </h2>
          <ExchangeListbox
            selectedItem={selectedUC}
            setSelectedItem={setSelectedUC}
            collection={ucs}
            arrowDown
          />
          <h2 className="px-2 py-1 text-sm font-semibold">
            Select the shift to leave
          </h2>
          <ExchangeListbox
            selectedItem={selectedShift}
            setSelectedItem={setSelectedShift}
            collection={shifts}
            arrowDown
          />
        </div>
        <div className="flex flex-col justify-center gap-4">
          <h2 className="px-2 text-sm font-semibold">
            Select your preferred shift
          </h2>
          <div className="flex w-full flex-col items-center gap-4 sm:flex-row">
            <div className="w-1/2">
              <ExchangeListbox
                selectedItem={selectedAvailableShifts}
                setSelectedItem={setSelectedAvailableShifts}
                collection={availableShifts}
                rounded
                label="Current shift"
              />
            </div>
            <span
              className="material-symbols-outlined rotate-90 sm:rotate-0"
              style={{ fontSize: "28px" }}
            >
              arrow_forward
            </span>
            <div className="w-1/2">
              <ExchangeListbox
                selectedItem={selectedMyShifts}
                setSelectedItem={setSelectedMyShifts}
                collection={myShifts}
                rounded
                label="Preferred shift"
                highlightText
              />
            </div>
          </div>
        </div>
        <p className="text-center text-sm text-black/50">
          Vais entrar numa fila de espera para este turno e, se possível, o SWAP
          trocar-te-á automaticamente com alguém que não queira estar no TP2.
        </p>
        <button
          type="submit"
          className="bg-celeste hover:bg-celeste/80 mt-4 cursor-pointer rounded-lg px-4 py-2 text-white/90 transition-all duration-150"
        >
          Add this exchange
        </button>
      </form>
    </div>
  );
}
