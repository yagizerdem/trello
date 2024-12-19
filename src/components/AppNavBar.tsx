export default function AppNavBar() {
  return (
    <nav
      class="w-full h-96  grid grid-cols-12 gap-4"
      style="box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;"
    >
      <a class="inline col-span-2">Logo</a>
      <div class="inline col-span-6">options</div>
      <div class="inline col-span-2">settings</div>
    </nav>
  );
}
