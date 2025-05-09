import { useEffect, useRef, useState } from "react";
import { Cell, Checkbox, Section } from "@telegram-apps/telegram-ui";
import type { FC, ReactNode } from "react";
import { Link } from "@/components/Link/Link";
import { bem } from "@/css/bem";

import "./DisplayData.css";
import { generateProof } from "../services/noir/proofGeneration";

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
  const [birthDate, setBirthDate] = useState("1997-04-30");
  const [proofType, setProofType] = useState("noir");
  const [logs, setLogs] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const addLog = (msg: string) => setLogs([msg]);

  const handleGenerateProof = () => {
    setResult(null);
    setLogs([]);
    setElapsedTime(0);
    startTimeRef.current = performance.now();

    const timer = setInterval(() => {
      if (startTimeRef.current) {
        const now = performance.now();
        setElapsedTime(now - startTimeRef.current);
      }
    }, 100);
    setIntervalId(timer);

    if (proofType === "noir") {
      const year = new Date(birthDate).getFullYear();
      generateProof(year, addLog, setResult, () => {
        if (startTimeRef.current) {
          const total = performance.now() - startTimeRef.current;
          setElapsedTime(total);
          clearInterval(timer);
        }
      });
    } else if (proofType === "circom") {
      alert("Circom Proof generated successfully!");
    } else if (proofType === "risc0") {
      alert("Risc0 Proof generated successfully!");
    }
  };

  return (
    <>
      <Section header={`Logs (${elapsedTime.toFixed(0)} ms)`}>
        <Cell>{logs}</Cell>
      </Section>
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
