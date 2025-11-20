import { Board } from "../../types";
export declare const minimalBoard: Board;
export declare const complexBoard: Board;
export declare const invalidBoards: {
    noTitle: {
        columns: never[];
    };
    noColumns: {
        title: string;
    };
    invalidPriority: {
        title: string;
        columns: {
            id: string;
            title: string;
            tasks: {
                id: string;
                title: string;
                priority: any;
            }[];
        }[];
    };
    invalidTemplate: {
        title: string;
        columns: {
            id: string;
            title: string;
            tasks: {
                id: string;
                title: string;
                template: any;
            }[];
        }[];
    };
};
//# sourceMappingURL=test-boards.d.ts.map