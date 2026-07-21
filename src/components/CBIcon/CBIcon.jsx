import { Add, Edit2, Trash } from 'iconsax-react';

export const ICON_SIZE = {
  sm: 16,
  md: 18,
  lg: 20,
};

export function IconAdd(props) {
  return <Add size={ICON_SIZE.md} color="currentColor" variant="Linear" {...props} />;
}

export function IconEdit(props) {
  return <Edit2 size={ICON_SIZE.sm} color="currentColor" variant="Linear" {...props} />;
}

export function IconTrash(props) {
  return <Trash size={ICON_SIZE.sm} color="currentColor" variant="Linear" {...props} />;
}
