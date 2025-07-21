const manaPath = ["/vi/manage", "/en/manage"];
const guestPath = ["/vi/guest", "/en/guest"];
const onlyOwnerPath = ["/vi/manage/accounts", "/en/manage/accounts"];
const unAuthPath = ["/vi/login", "/en/login", "/vi/register", "/en/register"];

export const privatePath = [...manaPath, ...guestPath];

export function isPathMatch(pathList: string[], pathname: string) {
    return pathList.some((path) => pathname.includes(path));
}

export { manaPath, guestPath, onlyOwnerPath, unAuthPath };
