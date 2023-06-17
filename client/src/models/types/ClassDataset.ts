import { Class } from "./Class";
import { Exam } from "./Exam";
import { MindMap } from "./MindMap";
import { Profile } from "./Profile";

export type ClassDataset = Class & {
    students: Profile[];
    mindMaps: MindMap[];
    testResults: Exam[];
}