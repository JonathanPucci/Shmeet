
export function logDebugInfo(info : string, title? : string) {
    console.log("===== " + title + " ===")
    console.log(info);
    console.log("=======================")
}

export function logDebugError(err : string, title? : string) {
    console.warn("******* " + title + " *****")
    console.warn(err);
    console.warn("***************************")
}
