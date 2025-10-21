import bcrypt from "bcryptjs";

//TODO Hash Password
export const hashCode = async (code: string) => {
  const salt = await bcrypt.genSalt(10);
  let codeString = code;
  if (process.env.NEXTAUTH_SECRET) {
    codeString += process.env.NEXTAUTH_SECRET;
  }
  const codeHash = await bcrypt
    .hash(codeString, salt)
    .then(function (hash: string) {
      return hash;
    });
  return codeHash;
};
//TODO Compare Password
export const compareCode = async (codeCompare: string, codeQuery: string) => {
  const result = await bcrypt.compare(
    codeCompare + process.env.NEXTAUTH_SECRET,
    codeQuery
  );
  return result;
};
