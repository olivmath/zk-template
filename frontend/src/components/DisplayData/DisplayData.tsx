import { useState } from "react";
import { Cell, Checkbox, Section } from "@telegram-apps/telegram-ui";
import type { FC, ReactNode } from "react";
import { Link } from "@/components/Link/Link";
import { bem } from "@/css/bem";

import "./DisplayData.css";

const [, e] = bem("display-data");

export type DisplayDataRow = { title: string } & (
  | { type: "link"; value?: string }
  | { value: ReactNode }
);

export interface DisplayDataProps {
  header?: ReactNode;
  footer?: ReactNode;
  rows: DisplayDataRow[];
}

export const DisplayData: FC<DisplayDataProps> = ({ header, rows }) => {
  const [birthDate, setBirthDate] = useState("");
  const [proofType, setProofType] = useState("risc0");

  const handleGenerateProof = () => {
    console.log("Generating proof with:", { birthDate, proofType });
    // Lógica de geração de prova pode ser chamada aqui
  };

  return (
    <>
      <Section header="Proof of Birth">
        <Cell className={e("line")} subhead="Your birth date" multiline>
          <input
            type="date"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className={e("input")}
          />
        </Cell>
        <Cell className={e("line")} subhead="Type of Proof" multiline>
          <select
            value={proofType}
            onChange={(e) => setProofType(e.target.value)}
            className={e("input")}
          >
            <option value="risc0">risc0</option>
            <option value="circom">circom</option>
            <option value="noir">noir</option>
          </select>
        </Cell>
        <Cell className={e("line")} subhead="Generate Proof" multiline>
          <button onClick={handleGenerateProof} className={e("button")}>
            Generate Proof
          </button>
        </Cell>
      </Section>

      <Section header={header}>
        {rows.map((item, idx) => {
          let valueNode: ReactNode;

          if (item.value === undefined) {
            valueNode = <i>empty</i>;
          } else {
            if ("type" in item) {
              valueNode = <Link href={item.value}>Open</Link>;
            } else if (typeof item.value === "string") {
              valueNode = item.value;
            } else if (typeof item.value === "boolean") {
              valueNode = <Checkbox checked={item.value} disabled />;
            } else {
              valueNode = item.value;
            }
          }

          return (
            <Cell
              className={e("line")}
              subhead={item.title}
              readOnly
              multiline
              key={idx}
            >
              <span className={e("line-value")}>{valueNode}</span>
            </Cell>
          );
        })}
      </Section>
    </>
  );
};
