export const filterObj = (obj: any, ...allowedFields: any) => {
  let newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj = obj[el];
  });

  return newObj;
};
