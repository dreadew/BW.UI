import type { Option } from "~/types/common.types";

export function normalizeOptions(options: (Option | string)[]) {
    return computed(() => {
        return options.map(option => {
            if (typeof option === "string") {
                return { value: option, label: option };
            }
            return option;
        });
    });
}