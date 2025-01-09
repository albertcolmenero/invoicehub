import { ClientForm } from "../[clientId]/components/client-form";

const NewClientPage = async () => {
  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ClientForm initialData={null} />
      </div>
    </div>
   );
}

export default NewClientPage; 