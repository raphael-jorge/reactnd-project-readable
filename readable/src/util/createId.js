export default function createId() {
  return Math.random().toString(36).substr(-8);
}
