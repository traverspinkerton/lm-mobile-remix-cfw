import type { MetaFunction, LoaderFunction } from "remix";
import { useLoaderData, json } from "remix";
import { BudgetData, getBudgetsForMonth } from "../lib/lm-api";

// <Head>
//   <title>Budget</title>
//   <link
//     rel="apple-touch-icon"
//     sizes="128x128"
//     href="/apple-touch-icon.png"
//   ></link>
// </Head>;

// export async function getServerSideProps({ req, params }) {
//   if (req.cookies.lm_secret !== process.env.SECRET) {
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };
//   }

//   const todaysMonth = new Date().getMonth();
//   const { budgets, total } = await getBudgetsForMonth();

//   return {
//     props: {
//       budgets,
//       total,
//     },
//   };
// }

export const loader: LoaderFunction = async () => {
  let data = await getBudgetsForMonth();
  return json(data);
};

export let meta: MetaFunction = () => {
  return {
    title: "Budget",
  };
};

export default function Budget() {
  let { budgets, total } = useLoaderData<BudgetData>();
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return (
    <>
      <form>
        <select name="month" className="rounded w-full mb-4">
          {months.map((month, index) => (
            <option
              key={month}
              label={month}
              value={index}
              selected={index === new Date().getMonth()}
            />
          ))}
        </select>
      </form>
      {!budgets.length ? (
        <p>hmm something is wrong</p>
      ) : (
        <ul>
          {budgets.map((budget, index) => (
            <li
              className="mb-2 p-2 rounded shadow-sm bg-yellow-100 flex justify-between"
              key={`${budget.category_id}_${String(index)}`}
            >
              {budget.category_name}:{" "}
              <span
                className={
                  Number(budget.amount.slice(1)) > 0
                    ? "text-green-500"
                    : "text-red-500"
                }
              >
                {budget.amount}
              </span>
            </li>
          ))}
        </ul>
      )}
      {/* <p>Budgeted: {total.budgeted}</p>
      <p>Spent: {total.spent}</p>
      <p>
        {total.budgeted > total.spent
          ? `${total.spent - total.budgeted} over budget`
          : `${total.budgeted - total.spent} under budget`}
      </p> */}
    </>
  );
}
