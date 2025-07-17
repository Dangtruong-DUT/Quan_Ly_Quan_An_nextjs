const manaPath = ["/manage"];
const guestPath = ["/guest"];
const onlyOwnerPath = ["/manage/accounts"];
const unAuthPath = ["/login", "/register"];

export const privatePath = [...manaPath, ...guestPath];

export function isPathMatch(pathList: string[], pathname: string) {
    return pathList.some((path) => pathname.startsWith(path));
}

export { manaPath, guestPath, onlyOwnerPath, unAuthPath };
