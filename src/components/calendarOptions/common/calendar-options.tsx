import AnimatedOptionsSection from "@/components/animated-options-section";
import TabsGroup, {
  PanelContainer,
  Tab,
  TabPanel,
  TabsContainer,
} from "@/components/tabs";
import React from "react";

interface ICalendarOptionsProps<T, sortedT> {
  currentItems: T[];
  editingItems: T[];
  itemsToAdd: T[];

  isEditing: boolean;
  hasChanges: boolean;

  setIsEditing: (editing: boolean) => void;
  setEditingItems: (items: T[]) => void;
  removeItem: (id: string) => void;
  addItem: (id: string) => void;
  saveChanges: () => void;
  clearItems: () => void;
  resetItems: () => void;

  title: string;
  description: string;

  DisplayComponent: React.ComponentType<{
    itemsSorted: sortedT[];
    isEditing?: boolean;
    state?: "add" | "remove";
    onAction?: (id: string) => void;
  }>;

  sortItems: (items: T[]) => sortedT[];
}

function ActionButtons({
  onClear,
  onReset,
}: {
  onClear: () => void;
  onReset: () => void;
}) {
  return (
    <div className="mb-3 flex items-center gap-3 px-2">
      <button
        onClick={onClear}
        className="text-danger group inline-flex cursor-pointer items-center gap-1 transition-all duration-300 hover:opacity-75"
      >
        <span className="material-symbols-outlined text-xl transition-all duration-300 group-hover:-rotate-20">
          delete
        </span>
        Clear
      </button>

      <button
        onClick={onReset}
        className="group inline-flex cursor-pointer items-center gap-1 text-[#625FEE] transition-all duration-300 hover:opacity-75"
      >
        <span className="material-symbols-outlined text-xl transition-all duration-300 group-hover:-rotate-20">
          autorenew
        </span>
        Reset
      </button>
    </div>
  );
}

function SaveButton({ onSave }: { onSave: () => void }) {
  return (
    <div className="pointer-events-none absolute bottom-2 z-10 flex w-full items-center justify-center">
      <button
        onClick={onSave}
        className="bg-primary-400 text-light pointer-events-auto w-36 cursor-pointer rounded-full px-2 py-2 font-semibold transition-transform duration-200 hover:scale-95"
      >
        Save
      </button>
    </div>
  );
}

export default function CalendarOptions<T, sortedT>({
  currentItems,
  editingItems,
  itemsToAdd,
  isEditing,
  hasChanges,
  setIsEditing,
  setEditingItems,
  removeItem,
  addItem,
  saveChanges,
  clearItems,
  resetItems,
  title,
  description,
  DisplayComponent,
  sortItems,
}: ICalendarOptionsProps<T, sortedT>) {
  return (
    <AnimatedOptionsSection
      isEditing={isEditing}
      setIsEditing={setIsEditing}
      currentItems={currentItems}
      setEditingItems={setEditingItems}
      classNameOpenedSection="p-4 flex flex-col h-full"
    >
      <section className="box-border flex h-full min-h-0 flex-1 flex-col">
        <div className="flex h-full min-h-0 flex-1 flex-col space-y-2.5">
          <div className="flex-shrink-0 px-2">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-semibold">{title}</h3>
              <button
                data-edit-button
                className="text-primary-400 cursor-pointer transition duration-300 hover:opacity-70"
              >
                Edit
              </button>
            </div>
            <p>{description}</p>
          </div>

          <div className="h-full min-h-0">
            <DisplayComponent itemsSorted={sortItems(currentItems)} />
          </div>
        </div>
      </section>

      <section className="box-border flex h-full min-h-0 flex-1 flex-col items-center">
        <TabsGroup
          defaultPanel="added"
          layoutId="options"
          className="flex h-full w-full flex-col items-center space-y-5"
        >
          <TabsContainer>
            <Tab name="Selected" icon="format_list_bulleted" refTo="added" />
            <Tab name="Add New" icon="add_circle" refTo="add" />
          </TabsContainer>

          <PanelContainer className="min-h-0 w-full flex-1 self-start">
            <TabPanel id="added" className="flex h-full min-h-0 flex-col">
              <h3 className="text-dark/50 mb-4 flex-shrink-0 pl-3">
                Already Selected
              </h3>

              <ActionButtons onClear={clearItems} onReset={resetItems} />

              <div className="relative min-h-0 flex-1">
                <DisplayComponent
                  isEditing
                  itemsSorted={sortItems(editingItems)}
                  state="remove"
                  onAction={removeItem}
                />
                {hasChanges && <SaveButton onSave={saveChanges} />}
              </div>
            </TabPanel>

            <TabPanel id="add" className="flex h-full min-h-0 flex-col">
              <h3 className="text-dark/50 mb-4 flex-shrink-0 pl-3">
                Available to add
              </h3>

              <ActionButtons onClear={clearItems} onReset={resetItems} />

              <div className="relative h-full min-h-0">
                <DisplayComponent
                  isEditing
                  itemsSorted={sortItems(itemsToAdd)}
                  state="add"
                  onAction={addItem}
                />
                {hasChanges && <SaveButton onSave={saveChanges} />}
              </div>
            </TabPanel>
          </PanelContainer>
        </TabsGroup>
      </section>
    </AnimatedOptionsSection>
  );
}
