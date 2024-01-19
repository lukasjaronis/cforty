import { z } from "zod";

export type TAPIResponse<TData> = {
	data: TData;
};

export const APIResponse = <TData>(json: TAPIResponse<TData>) => new Response(JSON.stringify(json), { status: 200 });
