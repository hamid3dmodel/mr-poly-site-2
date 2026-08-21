import type { Config, Slot } from "@puckeditor/core";
import MediaField from "./MediaField";
import AssetList from "@/components/AssetList";
import AssetSelectorField from "./AssetSelectorField";
import AssetEditorField, {
    type EditableAsset,
} from "./AssetEditorField";

type Props = {
    Section: {
        content: Slot;
        background: "transparent" | "surface" | "dark";
        paddingTop: number;
        paddingBottom: number;
        maxWidth: "full" | "xl" | "lg" | "md";
    };

    Container: {
        content: Slot;
        maxWidth: "full" | "xl" | "lg" | "md";
        paddingX: number;
    };

    Columns: {
        left: Slot;
        right: Slot;
        columns: "2" | "3";
        gap: number;
        align: "start" | "center" | "end";
    };

    Grid: {
        content: Slot;
        columns: "2" | "3" | "4";
        gap: number;
    };

    Spacer: {
        height: number;
    };

    Divider: {
        marginTop: number;
        marginBottom: number;
    };

    Heading: {
        text: string;
        level: "h1" | "h2" | "h3" | "h4";
        align: "left" | "center" | "right";
    };

    Text: {
        text: string;
        align: "left" | "center" | "right";
    };

    Image: {
        image: string;
        alt: string;
        width: "full" | "large" | "medium" | "small";
        aspectRatio: "auto" | "16/9" | "4/3" | "1/1";
        radius: number;
    };

    AssetList: {
        title: string;
        description: string;
        selection: "all" | "filter" | "manual";
        style: "all" | "low-poly" | "realistic";
        category: "all" | "vehicles" | "characters" | "environments" | "nature";
        selectedAssets: string[];
        sort: "default" | "name-asc" | "name-desc";
        limit: number;
        columns: "1" | "2" | "3" | "4";
        gap: number;
        cardStyle: "bordered" | "minimal" | "flat";
        cardRadius: number;
        cardPadding: number;
        imageAspect: "4/3" | "16/9" | "1/1" | "auto";
        showImage: boolean;
        showBadges: boolean;
        showDescription: boolean;
        showButton: boolean;
        buttonText: string;
        imageHover: boolean;
    };

    AssetEditor: {
        asset: EditableAsset;
    };

    Button: {
        text: string;
        href: string;
        variant: "primary" | "secondary" | "ghost";
        align: "left" | "center" | "right";
    };
};

export const puckConfig: Config<Props> = {
    root: {
        fields: {
            title: {
                type: "text",
                label: "Page Title",
            },

            description: {
                type: "textarea",
                label: "Page Description",
            },

            seoTitle: {
                type: "text",
                label: "SEO Title",
            },

            seoDescription: {
                type: "textarea",
                label: "SEO Description",
            },

            showHeader: {
                type: "select",
                label: "Header",
                options: [
                    {
                        label: "Show",
                        value: "show",
                    },
                    {
                        label: "Hide",
                        value: "hide",
                    },
                ],
            },

            showFooter: {
                type: "select",
                label: "Footer",
                options: [
                    {
                        label: "Show",
                        value: "show",
                    },
                    {
                        label: "Hide",
                        value: "hide",
                    },
                ],
            },
        },

        defaultProps: {
            title: "MR POLY",
            description: "",
            seoTitle: "",
            seoDescription: "",
            showHeader: "show",
            showFooter: "show",
        },

        render: ({ children }) => {
            return <>{children}</>;
        },
    },

    categories: {
        layout: {
            title: "Layout",
            components: [
                "Section",
                "Container",
                "Columns",
                "Grid",
                "Spacer",
                "Divider",
            ],
            defaultExpanded: true,
        },

        content: {
            title: "Content",
            components: [
                "Heading",
                "Text",
                "Image",
                "AssetList",
                "Button",
            ],
            defaultExpanded: true,
        },
    },

    components: {
        Section: {
            label: "Section",

            fields: {
                content: {
                    type: "slot",
                },

                background: {
                    type: "select",
                    label: "Background",
                    options: [
                        {
                            label: "Transparent",
                            value: "transparent",
                        },
                        {
                            label: "Surface",
                            value: "surface",
                        },
                        {
                            label: "Dark",
                            value: "dark",
                        },
                    ],
                },

                paddingTop: {
                    type: "number",
                    label: "Padding Top",
                },

                paddingBottom: {
                    type: "number",
                    label: "Padding Bottom",
                },

                maxWidth: {
                    type: "select",
                    label: "Max Width",
                    options: [
                        {
                            label: "Full",
                            value: "full",
                        },
                        {
                            label: "Extra Large",
                            value: "xl",
                        },
                        {
                            label: "Large",
                            value: "lg",
                        },
                        {
                            label: "Medium",
                            value: "md",
                        },
                    ],
                },
            },

            defaultProps: {
                content: [],
                background: "transparent",
                paddingTop: 80,
                paddingBottom: 80,
                maxWidth: "xl",
            },

            render: ({
                         content: Content,
                         background,
                         paddingTop,
                         paddingBottom,
                         maxWidth,
                     }) => {
                const widthClass =
                    maxWidth === "full"
                        ? "max-w-none"
                        : maxWidth === "lg"
                            ? "max-w-5xl"
                            : maxWidth === "md"
                                ? "max-w-3xl"
                                : "max-w-7xl";

                const backgroundClass =
                    background === "surface"
                        ? "bg-white/[0.03]"
                        : background === "dark"
                            ? "bg-black"
                            : "bg-transparent";

                return (
                    <section
                        className={`w-full ${backgroundClass}`}
                        style={{
                            paddingTop,
                            paddingBottom,
                        }}
                    >
                        <div
                            className={`mx-auto w-full px-6 ${widthClass}`}
                        >
                            <Content />
                        </div>
                    </section>
                );
            },
        },

        Container: {
            label: "Container",

            fields: {
                content: {
                    type: "slot",
                },

                maxWidth: {
                    type: "select",
                    label: "Max Width",
                    options: [
                        {
                            label: "Full",
                            value: "full",
                        },
                        {
                            label: "Extra Large",
                            value: "xl",
                        },
                        {
                            label: "Large",
                            value: "lg",
                        },
                        {
                            label: "Medium",
                            value: "md",
                        },
                    ],
                },

                paddingX: {
                    type: "number",
                    label: "Horizontal Padding",
                },
            },

            defaultProps: {
                content: [],
                maxWidth: "xl",
                paddingX: 24,
            },

            render: ({
                         content: Content,
                         maxWidth,
                         paddingX,
                     }) => {
                const widthClass =
                    maxWidth === "full"
                        ? "max-w-none"
                        : maxWidth === "lg"
                            ? "max-w-5xl"
                            : maxWidth === "md"
                                ? "max-w-3xl"
                                : "max-w-7xl";

                return (
                    <div
                        className={`mx-auto w-full ${widthClass}`}
                        style={{
                            paddingLeft: paddingX,
                            paddingRight: paddingX,
                        }}
                    >
                        <Content />
                    </div>
                );
            },
        },

        Columns: {
            label: "Columns",

            fields: {
                left: {
                    type: "slot",
                },

                right: {
                    type: "slot",
                },

                columns: {
                    type: "select",
                    label: "Layout",
                    options: [
                        {
                            label: "2 Columns",
                            value: "2",
                        },
                        {
                            label: "3 Columns",
                            value: "3",
                        },
                    ],
                },

                gap: {
                    type: "number",
                    label: "Gap",
                },

                align: {
                    type: "select",
                    label: "Vertical Alignment",
                    options: [
                        {
                            label: "Start",
                            value: "start",
                        },
                        {
                            label: "Center",
                            value: "center",
                        },
                        {
                            label: "End",
                            value: "end",
                        },
                    ],
                },
            },

            defaultProps: {
                left: [],
                right: [],
                columns: "2",
                gap: 32,
                align: "center",
            },

            render: ({
                         left: Left,
                         right: Right,
                         gap,
                         align,
                     }) => {
                return (
                    <div
                        className="grid grid-cols-1 md:grid-cols-2"
                        style={{
                            gap,
                            alignItems: align,
                        }}
                    >
                        <div className="min-w-0">
                            <Left />
                        </div>

                        <div className="min-w-0">
                            <Right />
                        </div>
                    </div>
                );
            },
        },

        Grid: {
            label: "Grid",

            fields: {
                content: {
                    type: "slot",
                },

                columns: {
                    type: "select",
                    label: "Columns",
                    options: [
                        {
                            label: "2",
                            value: "2",
                        },
                        {
                            label: "3",
                            value: "3",
                        },
                        {
                            label: "4",
                            value: "4",
                        },
                    ],
                },

                gap: {
                    type: "number",
                    label: "Gap",
                },
            },

            defaultProps: {
                content: [],
                columns: "3",
                gap: 24,
            },

            render: ({
                         content: Content,
                         columns,
                         gap,
                     }) => {
                const gridColumns =
                    columns === "2"
                        ? "md:grid-cols-2"
                        : columns === "4"
                            ? "md:grid-cols-2 lg:grid-cols-4"
                            : "md:grid-cols-2 lg:grid-cols-3";

                return (
                    <div
                        className={`grid grid-cols-1 ${gridColumns}`}
                        style={{
                            gap,
                        }}
                    >
                        <Content />
                    </div>
                );
            },
        },

        Spacer: {
            label: "Spacer",

            fields: {
                height: {
                    type: "number",
                    label: "Height",
                },
            },

            defaultProps: {
                height: 32,
            },

            render: ({ height }) => {
                return (
                    <div
                        aria-hidden="true"
                        style={{
                            height,
                        }}
                    />
                );
            },
        },

        Divider: {
            label: "Divider",

            fields: {
                marginTop: {
                    type: "number",
                    label: "Margin Top",
                },

                marginBottom: {
                    type: "number",
                    label: "Margin Bottom",
                },
            },

            defaultProps: {
                marginTop: 32,
                marginBottom: 32,
            },

            render: ({
                         marginTop,
                         marginBottom,
                     }) => {
                return (
                    <div
                        style={{
                            marginTop,
                            marginBottom,
                        }}
                    >
                        <div className="h-px w-full bg-white/10" />
                    </div>
                );
            },
        },

        Heading: {
            label: "Heading",

            fields: {
                text: {
                    type: "text",
                    label: "Text",
                },

                level: {
                    type: "select",
                    label: "Level",
                    options: [
                        {
                            label: "H1",
                            value: "h1",
                        },
                        {
                            label: "H2",
                            value: "h2",
                        },
                        {
                            label: "H3",
                            value: "h3",
                        },
                        {
                            label: "H4",
                            value: "h4",
                        },
                    ],
                },

                align: {
                    type: "select",
                    label: "Alignment",
                    options: [
                        {
                            label: "Left",
                            value: "left",
                        },
                        {
                            label: "Center",
                            value: "center",
                        },
                        {
                            label: "Right",
                            value: "right",
                        },
                    ],
                },
            },

            defaultProps: {
                text: "Heading",
                level: "h2",
                align: "left",
            },

            render: ({
                         text,
                         level,
                         align,
                     }) => {
                const Tag = level;

                const sizeClass =
                    level === "h1"
                        ? "text-5xl"
                        : level === "h2"
                            ? "text-4xl"
                            : level === "h3"
                                ? "text-3xl"
                                : "text-2xl";

                return (
                    <Tag
                        className={`font-bold tracking-tight ${sizeClass} text-${align}`}
                    >
                        {text}
                    </Tag>
                );
            },
        },

        Text: {
            label: "Text",

            fields: {
                text: {
                    type: "textarea",
                    label: "Text",
                },

                align: {
                    type: "select",
                    label: "Alignment",
                    options: [
                        {
                            label: "Left",
                            value: "left",
                        },
                        {
                            label: "Center",
                            value: "center",
                        },
                        {
                            label: "Right",
                            value: "right",
                        },
                    ],
                },
            },

            defaultProps: {
                text: "Add your text here.",
                align: "left",
            },

            render: ({ text, align }) => {
                return (
                    <p
                        className={`max-w-3xl text-lg leading-8 text-[var(--color-text-secondary)] text-${align}`}
                    >
                        {text}
                    </p>
                );
            },
        },

        Image: {
            label: "Image",

            fields: {
                image: {
                    type: "custom",
                    label: "Image",

                    render: ({ value, onChange }) => (
                        <MediaField
                            value={value}
                            onChange={onChange}
                        />
                    ),
                },

                alt: {
                    type: "text",
                    label: "Alt Text",
                },

                width: {
                    type: "select",
                    label: "Width",
                    options: [
                        {
                            label: "Full",
                            value: "full",
                        },
                        {
                            label: "Large",
                            value: "large",
                        },
                        {
                            label: "Medium",
                            value: "medium",
                        },
                        {
                            label: "Small",
                            value: "small",
                        },
                    ],
                },

                aspectRatio: {
                    type: "select",
                    label: "Aspect Ratio",
                    options: [
                        {
                            label: "Auto",
                            value: "auto",
                        },
                        {
                            label: "16:9",
                            value: "16/9",
                        },
                        {
                            label: "4:3",
                            value: "4/3",
                        },
                        {
                            label: "1:1",
                            value: "1/1",
                        },
                    ],
                },

                radius: {
                    type: "number",
                    label: "Border Radius",
                },
            },

            defaultProps: {
                image: "",
                alt: "",
                width: "full",
                aspectRatio: "auto",
                radius: 12,
            },

            render: ({
                         image,
                         alt,
                         width,
                         aspectRatio,
                         radius,
                     }) => {
                if (!image) {
                    return (
                        <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-white/20 bg-white/[0.02] text-sm text-zinc-500">
                            Select an image
                        </div>
                    );
                }

                const widthClass =
                    width === "large"
                        ? "max-w-5xl"
                        : width === "medium"
                            ? "max-w-3xl"
                            : width === "small"
                                ? "max-w-xl"
                                : "w-full";

                return (
                    <div
                        className={`mx-auto w-full overflow-hidden ${widthClass}`}
                        style={{
                            borderRadius: radius,
                        }}
                    >
                        <img
                            src={image}
                            alt={alt}
                            className="block h-auto w-full object-cover"
                            style={{
                                aspectRatio:
                                    aspectRatio === "auto"
                                        ? undefined
                                        : aspectRatio,
                            }}
                        />
                    </div>
                );
            },
        },

        AssetList: {
            label: "Asset List",

            fields: {
                title: { type: "text", label: "Title" },
                description: { type: "textarea", label: "Description" },
                selection: {
                    type: "select",
                    label: "Asset Source",
                    options: [
                        { label: "All Assets", value: "all" },
                        { label: "Filter Assets", value: "filter" },
                        { label: "Manual Selection", value: "manual" },
                    ],
                },
                style: {
                    type: "select",
                    label: "Style Filter",
                    options: [
                        { label: "All", value: "all" },
                        { label: "Low Poly", value: "low-poly" },
                        { label: "Realistic", value: "realistic" },
                    ],
                },
                category: {
                    type: "select",
                    label: "Category Filter",
                    options: [
                        { label: "All", value: "all" },
                        { label: "Vehicles", value: "vehicles" },
                        { label: "Characters", value: "characters" },
                        { label: "Environments", value: "environments" },
                        { label: "Nature", value: "nature" },
                    ],
                },
                selectedAssets: {
                    type: "custom",
                    label: "Select Assets",
                    render: ({ field, value, onChange }) => (
                        <AssetSelectorField
                            field={field}
                            value={value || []}
                            onChange={onChange}
                        />
                    ),
                },
                sort: {
                    type: "select",
                    label: "Sort",
                    options: [
                        { label: "Default", value: "default" },
                        { label: "Name A → Z", value: "name-asc" },
                        { label: "Name Z → A", value: "name-desc" },
                    ],
                },
                limit: { type: "number", label: "Maximum Assets" },
                columns: {
                    type: "select",
                    label: "Columns",
                    options: [
                        { label: "1", value: "1" },
                        { label: "2", value: "2" },
                        { label: "3", value: "3" },
                        { label: "4", value: "4" },
                    ],
                },
                gap: { type: "number", label: "Grid Gap" },
                cardStyle: {
                    type: "select",
                    label: "Card Style",
                    options: [
                        { label: "Bordered", value: "bordered" },
                        { label: "Minimal", value: "minimal" },
                        { label: "Flat", value: "flat" },
                    ],
                },
                cardRadius: { type: "number", label: "Card Radius" },
                cardPadding: { type: "number", label: "Card Padding" },
                imageAspect: {
                    type: "select",
                    label: "Image Aspect Ratio",
                    options: [
                        { label: "4:3", value: "4/3" },
                        { label: "16:9", value: "16/9" },
                        { label: "1:1", value: "1/1" },
                        { label: "Auto", value: "auto" },
                    ],
                },
                showImage: { type: "radio", label: "Show Image", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
                showBadges: { type: "radio", label: "Show Badges", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
                showDescription: { type: "radio", label: "Show Description", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
                showButton: { type: "radio", label: "Show Button", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
                buttonText: { type: "text", label: "Button Text" },
                imageHover: { type: "radio", label: "Image Hover", options: [{ label: "Yes", value: true }, { label: "No", value: false }] },
            },

            defaultProps: {
                title: "3D Assets",
                description: "",
                selection: "all",
                style: "all",
                category: "all",
                selectedAssets: [],
                sort: "default",
                limit: 0,
                columns: "4",
                gap: 24,
                cardStyle: "bordered",
                cardRadius: 16,
                cardPadding: 20,
                imageAspect: "4/3",
                showImage: true,
                showBadges: true,
                showDescription: true,
                showButton: true,
                buttonText: "View Asset",
                imageHover: true,
            },

            render: (props) => {
                return (
                    <AssetList
                        {...props}
                    />
                );
            },
        },

        AssetEditor: {
            label: "Asset Editor",

            fields: {
                asset: {
                    type: "custom",

                    label: "Asset",

                    render: ({
                                 field,
                                 value,
                                 onChange,
                             }) => (
                        <AssetEditorField
                            field={field}
                            value={
                                value
                            }
                            onChange={
                                onChange
                            }
                        />
                    ),
                },
            },

            defaultProps: {
                asset: {
                    id: "",
                    name: "New Asset",
                    slug: "new-asset",
                    style: "low-poly",
                    category: "environments",

                    shortDescription: "",
                    description: "",

                    thumbnail: "",

                    gallery: [],

                    features: [],

                    technicalSpecs: {
                        polygons: "",
                        textures: "",
                        formats: "",
                        engine: "",
                    },

                    stores: [],
                },
            },

            render: ({
                         asset,
                     }) => {
                if (!asset) {
                    return null;
                }

                return (
                    <div className="mx-auto w-full max-w-4xl">
                        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
                            {asset.thumbnail && (
                                <img
                                    src={
                                        asset.thumbnail
                                    }
                                    alt={
                                        asset.name
                                    }
                                    className="aspect-video w-full object-cover"
                                />
                            )}

                            <div className="p-8">
                                <div className="mb-4 flex flex-wrap gap-2 text-xs">
                            <span className="rounded-full border border-white/10 px-3 py-1">
                                {
                                    asset.style
                                }
                            </span>

                                    <span className="rounded-full border border-white/10 px-3 py-1">
                                {
                                    asset.category
                                }
                            </span>
                                </div>

                                <h1 className="text-4xl font-bold tracking-tight">
                                    {
                                        asset.name ||
                                        "Untitled Asset"
                                    }
                                </h1>

                                {asset.shortDescription && (
                                    <p className="mt-4 max-w-3xl text-lg leading-8 text-[var(--color-text-secondary)]">
                                        {
                                            asset.shortDescription
                                        }
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                );
            },
        },

        Button: {
            label: "Button",

            fields: {
                text: {
                    type: "text",
                    label: "Text",
                },

                href: {
                    type: "text",
                    label: "Link",
                },

                variant: {
                    type: "select",
                    label: "Variant",
                    options: [
                        {
                            label: "Primary",
                            value: "primary",
                        },
                        {
                            label: "Secondary",
                            value: "secondary",
                        },
                        {
                            label: "Ghost",
                            value: "ghost",
                        },
                    ],
                },

                align: {
                    type: "select",
                    label: "Alignment",
                    options: [
                        {
                            label: "Left",
                            value: "left",
                        },
                        {
                            label: "Center",
                            value: "center",
                        },
                        {
                            label: "Right",
                            value: "right",
                        },
                    ],
                },
            },

            defaultProps: {
                text: "Explore Assets",
                href: "/assets",
                variant: "primary",
                align: "left",
            },

            render: ({
                         text,
                         href,
                         variant,
                         align,
                     }) => {
                return (
                    <div className={`flex justify-${align}`}>
                        <a
                            href={href}
                            className={`btn btn-${variant}`}
                        >
                            {text}
                        </a>
                    </div>
                );
            },
        },
    },
};