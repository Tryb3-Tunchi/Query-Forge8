import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ConditionGroup } from "@/components/builder/ConditionGroup";
import { SCHEMAS } from "@/components/schema/schemas";
import { QueryGroup } from "@/types/query";
import { generateId } from "@/lib/utils";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock dnd-kit
vi.mock("@dnd-kit/core", () => ({
  DndContext: ({ children }: any) => <>{children}</>,
  PointerSensor: class {},
  useSensor: () => ({}),
  useSensors: () => [],
  closestCenter: () => null,
}));

vi.mock("@dnd-kit/sortable", () => ({
  SortableContext: ({ children }: any) => <>{children}</>,
  verticalListSortingStrategy: {},
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    transition: null,
    isDragging: false,
  }),
  arrayMove: (arr: any[]) => arr,
}));

// Mock zustand store
vi.mock("@/store/queryStore", () => ({
  useQueryStore: () => ({
    addRule: vi.fn(),
    addGroup: vi.fn(),
    removeNode: vi.fn(),
    moveNode: vi.fn(),
    updateRule: vi.fn(),
    updateGroupLogic: vi.fn(),
    toggleGroupCollapse: vi.fn(),
    setGroupLabel: vi.fn(),
  }),
}));

const schema = SCHEMAS.find((s) => s.id === "users")!;

function makeGroup(overrides: Partial<QueryGroup> = {}): QueryGroup {
  return {
    id: generateId(),
    type: "group",
    logic: "AND",
    collapsed: false,
    children: [
      {
        id: generateId(),
        type: "rule",
        field: "name",
        operator: "equals",
        value: "test",
      },
    ],
    ...overrides,
  };
}

describe("ConditionGroup", () => {
  it("renders without crashing", () => {
    const group = makeGroup();
    const { container } = render(
      <ConditionGroup
        group={group}
        depth={0}
        schema={schema}
        errors={[]}
        isRoot
      />,
    );
    expect(container).toBeTruthy();
  });

  it("renders AND/OR logic buttons", () => {
    const group = makeGroup({ logic: "AND" });
    render(
      <ConditionGroup
        group={group}
        depth={0}
        schema={schema}
        errors={[]}
        isRoot
      />,
    );
    expect(screen.getByText("AND")).toBeTruthy();
    expect(screen.getByText("OR")).toBeTruthy();
  });

  it("shows collapse button", () => {
    const group = makeGroup();
    render(
      <ConditionGroup
        group={group}
        depth={0}
        schema={schema}
        errors={[]}
        isRoot
      />,
    );
    // collapse button renders (▾ character)
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("does not show remove button on root group", () => {
    const group = makeGroup();
    render(
      <ConditionGroup
        group={group}
        depth={0}
        schema={schema}
        errors={[]}
        isRoot
      />,
    );
    expect(screen.queryByText(/Remove/i)).toBeNull();
  });

  it("shows remove button on non-root group", () => {
    const group = makeGroup();
    const onRemove = vi.fn();
    render(
      <ConditionGroup
        group={group}
        depth={1}
        schema={schema}
        errors={[]}
        onRemove={onRemove}
      />,
    );
    expect(screen.getByText(/Remove/i)).toBeTruthy();
  });

  it("renders collapsed state correctly", () => {
    const group = makeGroup({ collapsed: true });
    render(
      <ConditionGroup
        group={group}
        depth={0}
        schema={schema}
        errors={[]}
        isRoot
      />,
    );
    // children hidden when collapsed — Add Rule button not visible
    expect(screen.queryByText("Add Rule")).toBeNull();
  });

  it("renders children when not collapsed", () => {
    const group = makeGroup({ collapsed: false });
    render(
      <ConditionGroup
        group={group}
        depth={0}
        schema={schema}
        errors={[]}
        isRoot
      />,
    );
    expect(screen.getByText("Add Rule")).toBeTruthy();
  });
});
