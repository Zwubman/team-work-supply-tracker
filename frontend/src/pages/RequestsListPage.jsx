import RequestsList from "../components/lists/RequestsList";
import { useOutletContext } from "react-router-dom";

export default function RequestsListPage({ filter }) {
  const outletContext = useOutletContext && useOutletContext();
  const onApprove = outletContext?.loadItems || outletContext?.onApprove;
  return <RequestsList filter={filter} onApprove={onApprove} />;
}
