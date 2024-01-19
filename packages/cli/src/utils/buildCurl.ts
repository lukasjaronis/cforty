import { config } from "./config";

type TBuildCurl<TBody> = {
	method: "POST" | "GET" | "PUT" | "DELETE";
	endpoint: string;
	body?: TBody;
};

export const buildCurl = <TBody>(params: TBuildCurl<TBody>): string[] => {
	const data = config().get();
	const curlArray = ["-sSL", params.method, `-H`, `Authorization: Bearer ${data.bearer}`];

	if (params.body) {
		curlArray.push(
			"-H",
			"Content-Type: application/json",
			"--json",
			JSON.stringify(params.body),
		);
	}

	curlArray.push(`${data.apiUrl}${params.endpoint}`);

	return curlArray;
};
