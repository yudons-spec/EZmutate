EzMutate

EzMutate is a browser-based tool for translating coding DNA, locating amino-acid residues, and exploring codon options for single amino-acid substitutions. It displays aligned DNA and protein sequences, compares host-specific relative codon usage, and generates mutant protein previews and full-length DNA variants.

The app runs locally without installation or a server. The current interface focuses on mutation codon analysis; it does not design primers or calculate primer melting temperatures.

## Open the App

1. Download the project files. If downloaded as a ZIP, extract the archive first.
2. Keep these files together in the same folder:

   ```text
   EzMutate/
     index.html
     app.js
     styles.css
     README.md
   ```

3. Open `index.html` in a modern web browser, such as Chrome, Edge, or Firefox. JavaScript must be enabled.

To use EzMutate on another computer, transfer the entire folder and open `index.html` there. The folder may still be named `dna-primer-designer`; its name does not affect the app.

No account, package installation, or internet connection is required for the local app. External reference links require internet access.

## Quick Start

1. Click **Load demo**, or paste a coding sequence into **Coding DNA sequence**.
2. Check the **ATG start** and **terminal stop** requirements for your sequence.
3. Enter the residue number in **Target AA #** and click **Go** to locate and highlight it.
4. Enter the desired amino acid as one letter in **Desired AA**, such as `F` for phenylalanine.
5. Choose the **Host codon usage** preset and click **Analyze codons**.
6. Review the protein in **Overview**, compare candidates in **Codon usage**, and copy results from **Export**.

For a mutation such as `A82F`, enter `82` in **Target AA #** and `F` in **Desired AA**. Do not enter the full mutation label into either field. EzMutate determines the original residue from your DNA; confirm that its displayed label is `A82F`.

For translation only, leave both target fields empty and click **Analyze codons**.

## Prepare Your DNA Sequence

Enter one coding-strand sequence in the 5'-to-3' direction, starting at the first nucleotide of the intended reading frame. Plain sequence text or a single FASTA record is accepted:

```fasta
>example_orf
ATGGCTGAATTTTAA
```

EzMutate removes FASTA header lines, whitespace, and digits, converts lowercase to uppercase, and converts `U` to `T`. After this cleanup, only `A`, `T`, `G`, and `C` are accepted. Ambiguous bases such as `N`, gaps, and other symbols are rejected.

**Use only one FASTA record at a time.** Multiple records are not analyzed separately; their sequence lines would be joined together.

### Coding-Sequence Checks

| Check | Behavior |
| --- | --- |
| Reading frame | Sequence length must be divisible by three. Translation starts at the first entered nucleotide. |
| ATG start | When checked, the first codon must be `ATG`. Enabled by default. |
| Terminal stop | When checked, the last codon must be `TAA`, `TAG`, or `TGA`. Enabled by default. |
| Internal stops | Stop codons before the final codon are always rejected. |
| Protein content | At least one amino-acid residue must precede any terminal stop. |

You may uncheck a start or stop requirement for an intentional in-frame coding fragment. This does not disable the length or internal-stop checks.

EzMutate uses the **standard genetic code, translation table 1**. It does not extract an ORF from a longer sequence, remove introns, reverse-complement input, or correct frameshifts. Passing validation does not prove that a sequence is biologically correct or free of frameshift errors relative to a reference.

## Read the DNA/AA Panel

The panel below the DNA input displays four aligned rows in each sequence block:

| Row | Meaning |
| --- | --- |
| DNA nt # | Nucleotide coordinates for each codon, such as `1-3` and `4-6`. |
| DNA seq | The corresponding three-nucleotide codons. |
| AA # | Amino-acid position, starting at `1`. |
| AA seq | The translated one-letter amino-acid sequence. A stop is shown as `*`. |

Scroll within the panel to inspect the sequence. Enter a positive whole number in **Target AA #** and click **Go**, or press Enter, to bring that residue into view and highlight its aligned cells.

Numbering follows the supplied sequence, including any tags, signal peptides, or other encoded segments. The first translated residue is position `1`; it is not renumbered to match a mature protein or external reference. Residue `n` corresponds to nucleotides `3n - 2` through `3n`. For example, residue `82` corresponds to nucleotides `244-246`.

The panel always shows the **original input DNA and its translation**, not a mutated sequence. It updates while you type and can display a partial preview before full sequence validation succeeds.

**After editing DNA or changing the start/stop checkboxes, click Analyze codons to refresh the Workbench results.** A live preview alone does not mean the results have been refreshed.

## Specify a Mutation

Enter one target position and one desired amino-acid symbol at a time. Supported symbols are:

```text
A C D E F G H I K L M N P Q R S T V W Y
```

Lowercase symbols are converted to uppercase. Three-letter names, stop mutations (`*`), and nonstandard or ambiguous symbols are not supported. The target must fall within the translated protein; the terminal stop is not an eligible residue.

If the desired amino acid matches the original residue, EzMutate shows a warning but still lists synonymous codons. This can be used to inspect a codon change that leaves the protein unchanged. One candidate may be the original, unchanged codon.

Each analysis starts from the DNA currently in the input field. Mutations are not accumulated automatically, and the input DNA is not overwritten.

## Understand the Results

### Overview

The summary metrics show the input DNA length, translated protein length, input DNA GC percentage, and target position. DNA length includes a supplied terminal stop codon; protein length excludes the terminal stop.

With a valid mutation, **Protein sequence** displays:

1. **After mutation**, labeled with the substitution, such as `A82F`.
2. **Wild type**, showing the original translation for comparison.

Any terminal stop remains visible as `*`. Without a valid mutation target, the protein display contains only the original translation.

All codon candidates for the desired amino acid produce the same protein preview. The **Copy** button copies the entire displayed text, including headings and both sequences when present; it is not a protein FASTA export.

### Codon Usage

Available host presets are **E. coli K-12**, **S. cerevisiae**, and **H. sapiens**. Candidates are ordered by decreasing frequency in the selected preset.

| Column | Meaning |
| --- | --- |
| Codon | A DNA codon encoding the desired amino acid. |
| Desired AA | The desired residue, shown using one- and three-letter notation. |
| Relative usage | That codon's percentage among all codons encoding the desired amino acid. The underlying host frequency per 1,000 codons is shown underneath. |
| Rank | Usage order within the candidate list; `1/2` means first of two options. |
| DNA changes | Number of nucleotide differences between the original codon and the candidate, from zero to three. |
| Codon change | Original codon and proposed replacement. |

Relative usage is calculated as:

```text
Relative usage (%) = 100 x codon frequency
                    / sum of frequencies for all codons encoding the desired amino acid
```

For example, the app's embedded **E. coli K-12** preset contains these values for phenylalanine (`F`):

| Codon | Host frequency per 1,000 codons | Relative usage |
| --- | ---: | ---: |
| TTT | 19.7 | 56.8% |
| TTC | 15.0 | 43.2% |

These percentages describe the distribution within the desired amino acid's codon family, not the percentage of that codon in your input DNA. They are not RSCU values. Values are rounded to one decimal place, so displayed percentages may not sum to exactly 100%.

The presets are embedded data, not live database queries. The rank reflects only these frequencies, not an experimentally validated recommendation or a prediction of expression, folding, or function. No whole-gene codon optimization is performed.

## Export Results

Open **Export** after a successful mutation analysis. The app provides text and **Copy** buttons, not automatic file downloads.

### CSV Codon Table

The CSV contains one row per candidate codon with these fields:

```text
target_aa_position, wild_type_aa, wild_type_codon, desired_aa,
codon, relative_usage_percent, host_usage_per_1000, usage_rank, dna_changes
```

**Copy table** in the Codon usage tab copies the same CSV content. It can be imported into spreadsheet or analysis software.

The selected host name is not included in the CSV or FASTA headers. Record the host preset separately with your results.

### FASTA DNA Variants

FASTA output contains **one full-length DNA record for every candidate codon**. Each record replaces only the target codon in the original input. All other nucleotides, including any terminal stop codon, remain unchanged.

Headers identify the target, original and desired residues, replacement codon, and relative usage. This export contains DNA, not protein sequences or primers.

## Worked Example

1. Paste `ATGGCTGAATTTTAA` into **Coding DNA sequence**.
2. Leave **ATG start** and **terminal stop** checked.
3. Set **Target AA #** to `2` and **Desired AA** to `F`.
4. Select **E. coli K-12** and click **Analyze codons**.

Expected results:

- Input: 15 nucleotides; protein length: 4 amino acids.
- Wild type: `MAEF*`.
- Mutation: `A2F`; original codon: `GCT`.
- After mutation: `MFEF*`.
- Candidates: `TTT` at 56.8% relative usage and `TTC` at 43.2%.
- DNA changes: two for `GCT` to `TTT`, three for `GCT` to `TTC`.

The FASTA output is:

```fasta
>AA2_A_to_F_TTT_relative_56.8pct
ATGTTTGAATTTTAA
>AA2_A_to_F_TTC_relative_43.2pct
ATGTTCGAATTTTAA
```

## Troubleshooting

| Issue | What to check |
| --- | --- |
| Invalid DNA bases | Remove ambiguous bases, gaps, punctuation, or annotations outside a FASTA header. |
| Length is not a multiple of three | Check the sequence boundaries and any missing or extra nucleotides. The app does not repair the frame. |
| First codon is not ATG | Confirm the coding strand and start position, or uncheck the requirement for an intentional fragment. |
| Last codon is not a stop | Confirm the intended end of the coding sequence, or uncheck the requirement if a terminal stop is intentionally absent. |
| Internal stop codon | Check the reading frame, input sequence, and whether standard translation table 1 is appropriate. |
| Target is outside protein length | Use a position between `1` and the displayed protein length. Do not count the terminal stop. |
| Target check needed | Enter both a valid target number and a standard one-letter desired amino acid. |
| Results do not match edited DNA | Click **Analyze codons** again. The DNA/AA preview refreshes separately. |
| Copy does not work | Select the output text and use your browser's normal copy command. Clipboard access can depend on browser settings. |
| Page is unstyled or controls do nothing | Extract the ZIP and check that `index.html`, `styles.css`, and `app.js` are together. Confirm JavaScript is enabled. |

**Clear** removes the sequence, target, desired amino acid, and results. It leaves the host selection and start/stop checkbox settings unchanged.

## Local Data and Scope

- Sequence analysis runs in the browser. The app does not upload input sequences to a server.
- There is no built-in project saving or session persistence. Keep your input and exported results separately before closing or refreshing the page; do not rely on browser form restoration.
- Only one target residue is analyzed at a time. Insertions, deletions, stop substitutions, alternative genetic codes, and multi-mutation design are not supported.
- Candidate exports implement the requested codon replacement, not a complete construct validation. In particular, changing residue 1 can replace the initial `ATG`; review exported DNA against your requirements.
- The app does not assess primer design, restriction sites, RNA structure, mutation effects, or experimental suitability.

## Reference Links

The app includes links to the [NCBI genetic code tables](https://www.ncbi.nlm.nih.gov/Taxonomy/Utils/wprintgc.cgi#SG1) and the [Kazusa Codon Usage Database](https://www.kazusa.or.jp/codon/). Codon-usage values used during analysis are the presets stored in `app.js`, not values retrieved from these websites during a session.
