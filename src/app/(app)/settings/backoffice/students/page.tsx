"use client";

import { AuthCheck } from "@/components/auth-check";
import Avatar from "@/components/avatar";
import SettingsWrapper from "@/components/settings-wrapper";
import { useListStudents } from "@/lib/queries/backoffice";
import {
  FlopMetaParams,
  FlopMetaResponse,
  SortDirection,
  Student,
} from "@/lib/types";
import { firstLastName } from "@/lib/utils";
import clsx from "clsx";
import Link from "next/link";
import {
  useState,
  createContext,
  useContext,
  useMemo,
  useCallback,
} from "react";
import { twMerge } from "tailwind-merge";

interface SortState {
  column: string | null;
  direction: SortDirection;
}

interface ITableContext {
  meta: FlopMetaResponse;
  setCurrentPage: (page: number) => void;
  sortState: SortState;
  handleSort: (column: string) => void;
  getSortDirection: (column: string) => SortDirection;
}

const TableContext = createContext<ITableContext>({
  meta: {
    sort: [],
    filters: [],
    page_size: 8,
    current_page: 0,
    next_page: 1,
    previous_page: null,
    total_pages: 0,
    has_next_page: true,
    has_previous_page: false,
    total_entries: 0,
  },
  setCurrentPage: () => {},
  sortState: { column: null, direction: SortDirection.NONE },
  handleSort: () => {},
  getSortDirection: () => SortDirection.NONE,
});

function Table({ children }: { children: React.ReactNode }) {
  return <div className="border-dark/10 rounded-xl border">{children}</div>;
}

function TableHeader() {
  return (
    <div className="border-dark/10 grid grid-cols-[1fr_1fr_1fr_25px] border-b px-4 py-1 text-start lg:grid-cols-5">
      <HeaderElement
        className="text-start"
        value="name"
        sortable
        title="Name"
      />
      <HeaderElement
        className="text-center lg:text-start"
        value="number"
        sortable
        title="Number"
      />
      <HeaderElement className="hidden lg:block" title="Email" />
      <HeaderElement className="hidden text-center md:block" title="Status" />
      <div></div>
    </div>
  );
}

function HeaderElement({
  title,
  className,
  value,
  sortable = false,
}: {
  title: string;
  className?: string;
  value?: string;
  sortable?: boolean;
}) {
  const { handleSort, getSortDirection } = useContext(TableContext);
  const currentDirection = getSortDirection(value!);

  const getSortIcon = (direction: SortDirection) => {
    switch (direction) {
      case SortDirection.ASC:
        return "keyboard_arrow_up";
      case SortDirection.DESC:
        return "keyboard_arrow_down";
      default:
        return "unfold_more";
    }
  };

  return (
    <div className={className}>
      <button
        className={twMerge(
          clsx(
            "inline-flex w-fit items-center",
            sortable && "cursor-pointer gap-1",
          ),
        )}
        onClick={() => handleSort(value!)}
        aria-label={`Sort by ${title} ${currentDirection === SortDirection.NONE ? "" : currentDirection}`}
        disabled={!sortable}
      >
        <h2 className={clsx("text-dark/50 py-2 font-semibold")}>{title}</h2>
        {sortable && (
          <span className="material-symbols-outlined text-dark/60 text-lg">
            {getSortIcon(currentDirection)}
          </span>
        )}
      </button>
    </div>
  );
}

function TableContent({ children }: { children: React.ReactNode }) {
  return <div className="divide-dark/10 divide-y">{children}</div>;
}

function UserCard({ student }: { student: Student }) {
  return (
    <div className="grid grid-cols-[1fr_1fr_1fr_25px] items-center px-4 py-2 lg:grid-cols-5">
      <div className="flex items-center gap-4">
        <Avatar name={student.user.name} className="hidden size-12 lg:block" />
        <p>{firstLastName(student.user.name)}</p>
      </div>

      <p className="text-center lg:text-start">{student.number}</p>

      <p className="hidden lg:block">{student.user.email}</p>

      <p className="text-center">{student.special_status}</p>

      <div className="text-end">
        <Link
          href={`/settings/backoffice/students/${student.id}`}
          className="w-fit"
        >
          <span className="material-symbols-outlined text-end text-xl transition-all duration-200 hover:text-lg">
            edit
          </span>
        </Link>
      </div>
    </div>
  );
}

function TablePagination({
  range,
  entries,
}: {
  range: string;
  entries: number;
}) {
  const { setCurrentPage, meta } = useContext(TableContext);

  return (
    <div className="flex items-center justify-between px-4">
      <p>
        Showing <span className="font-semibold">{range}</span> of{" "}
        <span className="font-semibold">{entries}</span>{" "}
      </p>

      <div className="flex items-center gap-6">
        <button
          disabled={!meta.has_previous_page}
          className={twMerge(
            clsx(
              "flex items-center transition-opacity",
              meta.has_previous_page
                ? "cursor-pointer hover:opacity-80"
                : "opacity-20",
            ),
          )}
          onClick={() =>
            meta.previous_page && setCurrentPage(meta.previous_page)
          }
        >
          <span className="material-symbols-outlined hover:text-dark/50 cursor-pointer text-2xl">
            arrow_back
          </span>
        </button>
        <button
          disabled={!meta.has_next_page}
          className={twMerge(
            clsx(
              "flex items-center transition-opacity",
              meta.has_next_page
                ? "cursor-pointer hover:opacity-80"
                : "opacity-20",
            ),
          )}
          onClick={() => meta.next_page && setCurrentPage(meta.next_page)}
        >
          <span className="material-symbols-outlined hover:text-dark/50 cursor-pointer text-2xl">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}

export default function Students() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const [sortState, setSortState] = useState<SortState>({
    column: null,
    direction: SortDirection.NONE,
  });

  const handleSort = useCallback((column: string) => {
    setSortState((prevState) => {
      if (prevState.column === column) {
        switch (prevState.direction) {
          case SortDirection.NONE:
            return { column, direction: SortDirection.ASC };
          case SortDirection.ASC:
            return { column, direction: SortDirection.DESC };
          case SortDirection.DESC:
            return { column: null, direction: SortDirection.NONE };
          default:
            return { column, direction: SortDirection.ASC };
        }
      }
      return { column, direction: SortDirection.ASC };
    });

    setCurrentPage(1);
  }, []);

  const getSortDirection = useCallback(
    (column: string): SortDirection => {
      return sortState.column === column
        ? sortState.direction
        : SortDirection.NONE;
    },
    [sortState],
  );

  const PAGE_SIZE = 8;

  const queryParams = useMemo(() => {
    const filters = [];

    if (search.trim()) {
      filters.push({
        field: "name",
        op: "ilike_or",
        value: search.trim(),
      });
    }

    const params: FlopMetaParams = {
      filters: filters,
      page_size: PAGE_SIZE,
      page: currentPage,
    };

    if (sortState.column && sortState.direction !== SortDirection.NONE) {
      params["order_by[]"] = sortState.column;
      params["order_directions[]"] = sortState.direction;
    }

    return params;
  }, [currentPage, search, sortState]);

  const { data: studentsResponse, isLoading } = useListStudents(queryParams);

  const meta = studentsResponse?.meta || queryParams;
  const studentsList = studentsResponse?.users || [];

  const contextValue = {
    meta: meta || {
      sort: [],
      filters: [],
      page_size: PAGE_SIZE,
      page: currentPage,
      next_page: null,
      previous_page: null,
      total_pages: 0,
      has_next_page: false,
      has_previous_page: false,
      total_entries: 0,
    },
    setCurrentPage,
    sortState,
    handleSort,
    getSortDirection,
  };

  return (
    <AuthCheck userTypes={["admin", "professor"]}>
      <title>Pombo | Students</title>

      <SettingsWrapper title="Schedule Generator">
        <div className="flex h-full flex-col gap-8">
          <section className="flex">
            <div className="flex-1 space-y-2">
              <h2 className="text-2xl font-semibold">Students</h2>
            </div>

            <div className="w-1/2">
              <div
                className={clsx(
                  "bg-muted border-dark/10 flex w-full items-center gap-2 rounded-lg border px-1.5 py-1.5 text-sm/6",
                )}
              >
                <span className="material-symbols-outlined text-xl text-gray-500">
                  search
                </span>
                <input
                  placeholder="Search for student"
                  className="w-full truncate focus:not-data-focus:outline-none data-focus:outline-2 data-focus:-outline-offset-2 data-focus:outline-white/25"
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
            </div>
          </section>

          <section className="flex">
            <div className="w-full space-y-3">
              <TableContext.Provider value={contextValue}>
                <Table>
                  <TableHeader />

                  <TableContent>
                    {isLoading ? (
                      <p className="text-dark/50 py-32 text-center">
                        Loading...
                      </p>
                    ) : studentsList.length > 0 ? (
                      studentsList.map((student: Student) => (
                        <UserCard key={student.id} student={student} />
                      ))
                    ) : (
                      <p className="text-dark/50 py-32 text-center">No users</p>
                    )}
                  </TableContent>
                </Table>

                <TablePagination
                  range={`${(meta.current_page - 1) * meta.page_size + 1}-${Math.min(meta.current_page * meta.page_size, meta.total_entries)}`}
                  entries={meta.total_entries}
                />
              </TableContext.Provider>
            </div>
          </section>
        </div>
      </SettingsWrapper>
    </AuthCheck>
  );
}
