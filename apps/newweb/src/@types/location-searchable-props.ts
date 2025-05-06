import { Status } from "./enum/status";
import { Attachment } from "./product-props";
import { SearchableCities } from "./searchable-cities";


export interface LocationSearchableRequest {
    state: string;
    cities: string[];

}
