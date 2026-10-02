"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { LuChevronRight, LuHeart, LuSearch } from "react-icons/lu";
import { useAuth } from "@/components/auth/AuthProvider";
import { LoginFirstModal } from "@/components/baby-names/LoginFirstModal";
import { favouriteNamesKey, readFavouriteNameIds, toggleFavouriteNameId } from "@/lib/favourite-names";
import { displayName, girlNameFavouriteId } from "@/lib/girl-name-format";
import { findGirlNameGroup, GIRL_NAME_LETTERS, type GirlNameGroup } from "@/lib/girl-names";

type SortMode = "popularity" | "az";
type FilterMode = "all" | "popular";

export function BabyNamesBrowser({
  letter,
  groups,
  tokenParam,
}: {
  letter: string;
  groups: GirlNameGroup[];
  tokenParam: string | null;
}) {
  const activeGroup = findGirlNameGroup(letter, tokenParam, groups);

  if (activeGroup) {
    return <TokenDetailView letter={letter} group={activeGroup} />;
  }

  return <TokenGridView letter={letter} groups={groups} />;
}

function useFavourites() {
  const { user, ready } = useAuth();
  const [saved, setSaved] = useState<string[]>([]);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      setSaved([]);
      return;
    }
    const signedIn = user;

    function refresh() {
      setSaved(readFavouriteNameIds(signedIn.id));
    }

    refresh();

    function onStorage(event: StorageEvent) {
      if (event.key !== favouriteNamesKey(signedIn.id)) return;
      refresh();
    }

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [user]);

  function toggle(fullName: string) {
    if (!ready) return;
    if (!user) {
      setLoginOpen(true);
      return;
    }
    try {
      setSaved(toggleFavouriteNameId(user.id, girlNameFavouriteId(fullName)));
    } catch {
      setSaved(readFavouriteNameIds(user.id));
    }
  }

  return { saved, toggle, loginOpen, setLoginOpen, ready };
}

function TokenGridView({ letter, groups }: { letter: string; groups: GirlNameGroup[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterMode>("all");
  const [sort, setSort] = useState<SortMode>("popularity");
  const [view, setView] = useState<"browse" | "favourites">("browse");
  const { saved, toggle, loginOpen, setLoginOpen, ready } = useFavourites();

  const filtered = useMemo(() => {
    let list = groups;

    if (filter === "popular") {
      list = list.filter((group) => (group.names[0]?.popularity ?? 0) >= 2);
    }

    const trimmed = query.trim().toLowerCase();
    if (trimmed) {
      list = list.filter((group) => group.token.includes(trimmed));
    }

    list = [...list];
    if (sort === "az") {
      list.sort((left, right) => left.token.localeCompare(right.token));
    } else {
      list.sort((left, right) => {
        const byPopularity = (right.names[0]?.popularity ?? 0) - (left.names[0]?.popularity ?? 0);
        if (byPopularity !== 0) return byPopularity;
        return left.token.localeCompare(right.token);
      });
    }

    return list;
  }, [filter, groups, query, sort]);

  const favouriteRows = useMemo(
    () => saved.map((id) => ({ id, label: displayName(id) })).sort((a, b) => a.label.localeCompare(b.label)),
    [saved],
  );

  return (
    <div className="mt-6 space-y-6">
      <section className="overflow-hidden rounded-4xl border border-mist bg-gradient-to-br from-mist/80 via-white to-petal shadow-sm">
        <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sage">Girl names</p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-ink sm:text-3xl">
              Browse by name token
            </h2>
            <p className="mt-2 text-sm leading-6 text-dusk">
              Pick a letter, open a token, and explore full names from the collected list.
            </p>
          </div>
          <div className="hidden shrink-0 sm:block" aria-hidden="true">
            <NameHeroArt />
          </div>
        </div>

        <div className="border-t border-mist/80 bg-white/70 px-4 py-4 sm:px-8">
          <label className="relative block">
            <span className="sr-only">Search tokens</span>
            <LuSearch className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-dusk" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by token…"
              className="h-12 w-full rounded-full border border-mist bg-white pl-12 pr-4 text-sm text-ink outline-none ring-sage/30 placeholder:text-dusk/70 focus:ring-2"
            />
          </label>
        </div>
      </section>

      <nav aria-label="Browse or favourites" className="flex flex-wrap gap-2">
        <TabButton active={view === "browse"} onClick={() => setView("browse")}>
          Browse
        </TabButton>
        <TabButton active={view === "favourites"} onClick={() => setView("favourites")}>
          Favourite names
          {saved.length > 0 ? (
            <span className="ml-1.5 rounded-full bg-lagoon/20 px-2 py-0.5 text-xs tabular-nums text-sage-dark">
              {saved.length}
            </span>
          ) : null}
        </TabButton>
      </nav>

      {view === "favourites" ? (
        <FavouritesPanel rows={favouriteRows} onToggle={toggle} ready={ready} />
      ) : (
        <>
          <nav aria-label="Filter by first letter" className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
            {GIRL_NAME_LETTERS.map((item) => {
              const active = item === letter;
              return (
                <Link
                  key={item}
                  href={`/baby-names?letter=${item}`}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex h-10 min-w-10 shrink-0 items-center justify-center rounded-full px-3 text-sm font-semibold ${
                    active
                      ? "bg-lagoon text-white shadow-sm"
                      : "border border-mist bg-white text-sage-dark hover:bg-mist/50"
                  }`}
                >
                  {item}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
                All
              </FilterChip>
              <FilterChip active={filter === "popular"} onClick={() => setFilter("popular")}>
                Popular
              </FilterChip>
            </div>
            <label className="flex items-center gap-2 text-sm text-dusk">
              <span className="shrink-0 font-medium">Sort</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value as SortMode)}
                className="h-11 min-w-40 rounded-full border border-mist bg-white px-4 text-sm font-medium text-ink outline-none focus:ring-2 focus:ring-sage/30"
              >
                <option value="popularity">Popularity</option>
                <option value="az">A–Z</option>
              </select>
            </label>
          </div>

          {groups.length === 0 ? (
            <EmptyState message={`No names start with ${letter}.`} />
          ) : filtered.length === 0 ? (
            <EmptyState message="No tokens match your search or filter." />
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((group) => (
                <li key={group.token}>
                  <Link
                    href={`/baby-names?letter=${letter}&token=${encodeURIComponent(group.token)}`}
                    className="group flex items-center gap-3 rounded-2xl border border-mist bg-white p-4 shadow-sm transition hover:border-lagoon/40 hover:shadow-md"
                  >
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-mist text-sm font-bold text-sage-dark">
                      {displayName(group.token).charAt(0)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-semibold text-ink">{displayName(group.token)}</span>
                      <span className="mt-0.5 block text-sm text-dusk">
                        {group.names.length} full {group.names.length === 1 ? "name" : "names"}
                      </span>
                    </span>
                    <LuChevronRight className="size-5 shrink-0 text-dusk transition group-hover:translate-x-0.5 group-hover:text-sage" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </>
      )}

      {loginOpen ? <LoginFirstModal onClose={() => setLoginOpen(false)} /> : null}
    </div>
  );
}

function TokenDetailView({ letter, group }: { letter: string; group: GirlNameGroup }) {
  const [query, setQuery] = useState("");
  const { saved, toggle, loginOpen, setLoginOpen, ready } = useFavourites();

  const names = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    let list = group.names;
    if (trimmed) {
      list = list.filter((name) => name.fullName.includes(trimmed));
    }
    return list;
  }, [group.names, query]);

  return (
    <div className="mt-6 space-y-5">
      <nav aria-label="Breadcrumb" className="text-sm text-dusk">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href={`/baby-names?letter=${letter}`} className="font-medium text-sage hover:text-sage-dark">
              Baby names
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/baby-names?letter=${letter}`} className="font-medium text-sage hover:text-sage-dark">
              Letter {letter}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li className="font-semibold text-ink">{displayName(group.token)}</li>
        </ol>
      </nav>

      <section className="rounded-4xl border border-mist bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="inline-flex size-16 items-center justify-center rounded-full bg-lagoon/15 text-2xl font-bold text-sage-dark">
              {displayName(group.token).charAt(0)}
            </span>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-sage">Token</p>
              <h2 className="text-2xl font-semibold text-ink sm:text-3xl">{displayName(group.token)}</h2>
              <p className="mt-1 text-sm text-dusk">
                {group.names.length} full {group.names.length === 1 ? "name" : "names"} in the list
              </p>
            </div>
          </div>
          <Link
            href={`/baby-names?letter=${letter}`}
            className="inline-flex h-11 items-center justify-center rounded-full border border-mist px-5 text-sm font-semibold text-sage-dark hover:bg-petal"
          >
            Back to tokens
          </Link>
        </div>

        <label className="relative mt-6 block">
          <span className="sr-only">Search within these names</span>
          <LuSearch className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-dusk" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search within these names…"
            className="h-12 w-full rounded-full border border-mist bg-petal pl-12 pr-4 text-sm text-ink outline-none ring-sage/30 placeholder:text-dusk/70 focus:ring-2"
          />
        </label>
      </section>

      {names.length === 0 ? (
        <EmptyState message="No full names match your search." />
      ) : (
        <ul className="space-y-3">
          {names.map((name) => {
            const savedId = girlNameFavouriteId(name.fullName);
            const isSaved = saved.includes(savedId);
            return (
              <li
                key={savedId}
                className="flex items-center gap-3 rounded-2xl border border-mist bg-white p-4 shadow-sm sm:gap-4 sm:p-5"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-base font-semibold text-ink">{displayName(name.fullName)}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-dusk">
                    <LuHeart className="size-4 shrink-0 text-lagoon" aria-hidden="true" />
                    <span>
                      Recorded <span className="font-semibold tabular-nums text-ink">{name.popularity}</span>{" "}
                      {name.popularity === 1 ? "time" : "times"} in the list
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  disabled={!ready}
                  onClick={() => toggle(name.fullName)}
                  aria-label={isSaved ? "Remove from favourites" : "Add to favourite"}
                  aria-pressed={isSaved}
                  className={`inline-flex size-12 shrink-0 items-center justify-center rounded-full border transition disabled:opacity-70 ${
                    isSaved
                      ? "border-transparent bg-rose-100 text-rose-600"
                      : "border-mist bg-petal text-dusk hover:border-lagoon/40 hover:text-sage"
                  }`}
                >
                  <LuHeart className={`size-5 ${isSaved ? "fill-current" : ""}`} />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {loginOpen ? <LoginFirstModal onClose={() => setLoginOpen(false)} /> : null}
    </div>
  );
}

function FavouritesPanel({
  rows,
  onToggle,
  ready,
}: {
  rows: { id: string; label: string }[];
  onToggle: (fullName: string) => void;
  ready: boolean;
}) {
  const { user } = useAuth();

  if (!user) {
    return (
      <section className="rounded-4xl border border-mist bg-white px-6 py-10 text-center shadow-sm">
        <p className="text-sm leading-6 text-dusk">Sign in to see names you saved on this device.</p>
        <Link
          href="/login"
          className="mt-4 inline-flex h-11 items-center justify-center rounded-full bg-sage px-6 text-sm font-semibold text-white hover:bg-sage-dark"
        >
          Go to login
        </Link>
      </section>
    );
  }

  if (rows.length === 0) {
    return (
      <section className="rounded-4xl border border-mist bg-white px-6 py-10 text-center shadow-sm">
        <p className="text-sm leading-6 text-dusk">You have not saved any favourites yet.</p>
      </section>
    );
  }

  return (
    <ul className="space-y-3">
      {rows.map((row) => (
        <li
          key={row.id}
          className="flex items-center gap-3 rounded-2xl border border-mist bg-white px-4 py-4 shadow-sm sm:px-5"
        >
          <LuHeart className="size-5 shrink-0 fill-rose-500 text-rose-500" aria-hidden="true" />
          <span className="min-w-0 flex-1 font-semibold text-ink">{row.label}</span>
          <button
            type="button"
            disabled={!ready}
            onClick={() => onToggle(row.id)}
            aria-label={`Remove ${row.label} from favourites`}
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-mist text-dusk hover:bg-petal disabled:opacity-70"
          >
            <LuHeart className="size-5 fill-rose-500 text-rose-500" />
          </button>
        </li>
      ))}
    </ul>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-11 items-center rounded-full px-5 text-sm font-semibold transition ${
        active ? "bg-lagoon text-white shadow-sm" : "border border-mist bg-white text-sage-dark hover:bg-mist/40"
      }`}
    >
      {children}
    </button>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-10 items-center rounded-full px-4 text-sm font-semibold transition ${
        active ? "bg-sage text-white" : "border border-mist bg-white text-sage-dark hover:bg-mist/40"
      }`}
    >
      {children}
    </button>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <section className="rounded-4xl border border-mist bg-white px-6 py-10 text-center shadow-sm">
      <p className="text-sm leading-6 text-dusk">{message}</p>
    </section>
  );
}

function NameHeroArt() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" aria-hidden="true">
      <circle cx="60" cy="60" r="56" fill="#d7eeed" />
      <circle cx="78" cy="38" r="10" fill="#5eb8b4" />
      <path
        d="M60 92c-18-11-30-22-30-34a16 16 0 0 1 30-9 16 16 0 0 1 30 9c0 12-12 23-30 34Z"
        fill="#f4b48a"
      />
      <circle cx="52" cy="58" r="3" fill="#2f3438" />
      <circle cx="68" cy="58" r="3" fill="#2f3438" />
      <path d="M54 68c4 3 8 3 12 0" stroke="#2f3438" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
