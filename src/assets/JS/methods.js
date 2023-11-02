export const uniqueID = function (length) {
  const chrs = "abdehkmnpswxzABDEFGHKMNPQRSTWXZ123456789";
  let str = "";
  for (let i = 0; i < length; i++) {
    let pos = Math.floor(Math.random() * chrs.length);
    str += chrs.substring(pos, pos + 1);
  }
  return str;
};

// data-tooltip="Add todo"
//  data-tooltip="Save changes"
//  data-tooltip="Edit this todo"
//  data-tooltip="Delete this todo"
//  data-tooltip="Save all changes"
// create note