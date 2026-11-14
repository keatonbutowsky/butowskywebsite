"use client";

import { Fragment } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import {
  contact,
  focus,
  now,
  record,
  speaking,
  toolkit,
  type Entry,
  type TextPart,
} from "@/lib/content";

const eyebrow =
  "mb-6 text-[0.72rem] uppercase tracking-[0.4em] text-[var(--muted)]";

const headline =
  "font-display text-[clamp(2rem,4.5vw,3.4rem)] font-normal leading-[1.02] tracking-[-0.015em]";

function NoteRef({ n }: { n: number }) {
  return (
    <sup>
      <a
        href={`#record-note-${n}`}
        onClick={(event) => {
          const note = document.getElementById(`record-note-${n}`);
          if (!note) return;
          event.preventDefault();
          const reduce = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
          ).matches;
          note.scrollIntoView({
            block: "nearest",
            behavior: reduce ? "auto" : "smooth",
          });
        }}
      >
        {n}
      </a>
    </sup>
  );
}

function Rich({ parts }: { parts: readonly TextPart[] }) {
  return parts.map((part, index) =>
    typeof part === "string" ? (
      <Fragment key={index}>{part}</Fragment>
    ) : (
      <b key={index}>{part.bold}</b>
    ),
  );
}

function EntryList({
  items,
  item,
}: {
  items: readonly Entry[];
  item: Variants;
}) {
  return (
    <ul>
      {items.map((entry, index) => (
        <motion.li
          key={entry.idx}
          variants={item}
          className={index === items.length - 1 ? "row last" : "row"}
        >
          <span className="r-num">{entry.idx}</span>
          <div className="r-body">
            <h3 className="r-title font-display">{entry.title}</h3>
            {entry.meta ? (
              <div className="r-meta">
                {entry.meta.map((meta) => (
                  <span key={meta}>{meta}</span>
                ))}
              </div>
            ) : null}
            {entry.description ? (
              <p className="r-desc">{entry.description}</p>
            ) : null}
          </div>
        </motion.li>
      ))}
    </ul>
  );
}

export function FocusPanel({ item }: { item: Variants }) {
  return (
    <>
      <motion.div variants={item} id="focus-title" className={eyebrow}>
        {focus.eyebrow}
      </motion.div>
      <motion.h2 variants={item} className={`${headline} mb-8`}>
        {focus.headline}
      </motion.h2>
      <ul>
        {focus.items.map((row, index) => (
          <motion.li
            key={row.idx}
            variants={item}
            className={
              "flex items-baseline gap-6 border-t border-[var(--hair)] py-6" +
              (index === focus.items.length - 1
                ? " border-b border-b-[var(--hair)]"
                : "")
            }
          >
            <span className="min-w-[2.2rem] text-[0.72rem] tracking-[0.2em] text-[var(--muted)]">
              {row.idx}
            </span>
            <span className="font-display text-[clamp(1.5rem,2.6vw,2.1rem)] font-light leading-none tracking-[-0.01em]">
              {row.title}
            </span>
          </motion.li>
        ))}
      </ul>
    </>
  );
}

export function ContactPanel({ item }: { item: Variants }) {
  return (
    <>
      <motion.div variants={item} id="contact-title" className={eyebrow}>
        {contact.eyebrow}
      </motion.div>
      <motion.h2 variants={item} className={`${headline} mb-10`}>
        {contact.headline}
      </motion.h2>
      <motion.a
        variants={item}
        href={`mailto:${contact.email}`}
        className="font-display w-fit text-[clamp(1.5rem,3vw,2.4rem)] font-light tracking-[-0.01em] text-white underline-offset-8 hover:underline focus-visible:underline focus-visible:outline-none"
      >
        {contact.email}
      </motion.a>
      <motion.div
        variants={item}
        className="mt-12 flex flex-col gap-2 text-[0.82rem] uppercase tracking-[0.32em] text-[var(--muted)]"
      >
        <a
          href={contact.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none"
        >
          LinkedIn
        </a>
        <span>{contact.location}</span>
      </motion.div>
    </>
  );
}

export function RecordPanel({ item }: { item: Variants }) {
  return (
    <>
      <motion.h2
        variants={item}
        id="record-title"
        className={`${eyebrow} font-normal`}
      >
        {record.eyebrow}
      </motion.h2>
      <motion.div variants={item} className="totals">
        {record.totals.map((total) => (
          <div key={total.label} className="tot">
            <div className="tot-lab">{total.label}</div>
            <div className="tot-fig font-display">{total.figure}</div>
            <div className="tot-math">
              {total.lines.map((line) => (
                <span key={line.text}>
                  {line.plus ? <i>+</i> : null}
                  {line.text}
                  {line.note ? <NoteRef n={line.note} /> : null}
                </span>
              ))}
            </div>
            <div className="tot-sub">{total.sub}</div>
          </div>
        ))}
      </motion.div>
      <motion.div variants={item} className="ac">
        <div className="ac-head">
          <h3 className="ac-title">{record.assetTitle}</h3>
          {record.columns.map((column) => (
            <div key={column} className="ac-ch">
              {column}
            </div>
          ))}
        </div>
        {record.assets.map((asset) => (
          <div key={asset.name} className="ac-row">
            <h4 className="ac-name font-display">{asset.name}</h4>
            {([asset.acquired, asset.managed] as const).map((cell) => (
              <div key={cell.figure + cell.detail}>
                <div className="ac-fig font-display">{cell.figure}</div>
                <div className="ac-bar" aria-hidden="true">
                  <div
                    className="ac-fill"
                    style={{ width: `${cell.width}%` }}
                  />
                </div>
                <div className="ac-det">{cell.detail}</div>
              </div>
            ))}
          </div>
        ))}
        <ol className="ac-notes">
          {record.notes.map((note, index) => (
            <li key={note} id={`record-note-${index + 1}`}>
              {note}
            </li>
          ))}
        </ol>
      </motion.div>
      <motion.h3 variants={item} className="grp-lab">
        {record.currentLabel}
      </motion.h3>
      <motion.div variants={item} className="cur">
        {record.current.map((role) => (
          <div key={role.letters} className="cur-item">
            <div className="lg mono" aria-hidden="true">
              <span className="font-display">{role.letters}</span>
            </div>
            <div>
              <div className="cur-lead font-display">{role.lead}</div>
              <p className="cur-sub">{role.sub}</p>
            </div>
          </div>
        ))}
      </motion.div>
      <motion.h3 variants={item} className="grp-lab">
        {record.previousLabel}
      </motion.h3>
      {record.previous.map((company) => (
        <motion.article key={company.name} variants={item} className="card">
          {company.logo.type === "duo" ? (
            <div className="lg duo">
              {company.logo.marks.map((mark) => (
                <Image
                  key={mark.src}
                  src={mark.src}
                  alt={mark.alt}
                  width={mark.width}
                  height={mark.height}
                  className={mark.variant}
                />
              ))}
            </div>
          ) : (
            <div className="lg">
              <Image
                src={company.logo.src}
                alt={company.logo.alt}
                width={company.logo.width}
                height={company.logo.height}
                className={
                  company.logo.variant === "default"
                    ? undefined
                    : company.logo.variant
                }
              />
            </div>
          )}
          <div>
            <h4 className="c-name font-display">{company.name}</h4>
            <div className="c-title">{company.title}</div>
            <dl className={`c-stats n${company.stats.length}`}>
              {company.stats.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>
                    <span className="font-display">{stat.value}</span>
                    {stat.detail ? <em>{stat.detail}</em> : null}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="c-sum">
              <Rich parts={company.summary} />
            </p>
          </div>
          <div className="c-chips">
            {company.chips.map((chip) => (
              <span key={chip} className="chip">
                {chip}
              </span>
            ))}
          </div>
        </motion.article>
      ))}
    </>
  );
}

export function NowPanel({ item }: { item: Variants }) {
  return (
    <>
      <motion.div variants={item} id="now-title" className={eyebrow}>
        {now.eyebrow}
      </motion.div>
      <motion.h2 variants={item} className={`${headline} mb-8`}>
        {now.headline}
      </motion.h2>
      <EntryList items={now.items} item={item} />
    </>
  );
}

export function SpeakingPanel({ item }: { item: Variants }) {
  return (
    <>
      <motion.div variants={item} id="speaking-title" className={eyebrow}>
        {speaking.eyebrow}
      </motion.div>
      <motion.h2 variants={item} className={`${headline} mb-8`}>
        {speaking.headline}
      </motion.h2>
      <motion.div variants={item} className="trusted">
        <div className="t-lab2">{speaking.trustedLabel}</div>
        <div className="t-marks">
          {speaking.trusted.map((name) => (
            <span key={name} className="font-display">
              {name}
            </span>
          ))}
        </div>
      </motion.div>
      <EntryList items={speaking.items} item={item} />
    </>
  );
}

export function ToolkitPanel({ item }: { item: Variants }) {
  return (
    <>
      <motion.div variants={item} id="toolkit-title" className={eyebrow}>
        {toolkit.eyebrow}
      </motion.div>
      <motion.h2 variants={item} className={`${headline} mb-8`}>
        {toolkit.headline}
      </motion.h2>
      <EntryList items={toolkit.items} item={item} />
    </>
  );
}
