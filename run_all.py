# -*- coding: utf-8 -*-
"""
Blinkit Sales Analysis — Master Runner Script
==============================================
Run this single script to execute the complete analysis pipeline:
  1. Data Generation (if raw data doesn't exist)
  2. Data Cleaning
  3. EDA & Business Insights
  4. EDA Visualisations (12 charts saved to screenshots/)

Usage:
    python run_all.py
"""

import os
import sys
import time
import subprocess

# ── Resolve project root ──────────────────────────────────────────────────────
ROOT = os.path.dirname(os.path.abspath(__file__))

PIPELINE = [
    ("Step 1/4  Dataset Generation",   os.path.join(ROOT, "notebooks", "01_generate_dataset.py")),
    ("Step 2/4  Data Cleaning",         os.path.join(ROOT, "notebooks", "02_data_cleaning.py")),
    ("Step 3/4  EDA & Insights",        os.path.join(ROOT, "notebooks", "03_eda_insights.py")),
    ("Step 4/4  EDA Visualisations",    os.path.join(ROOT, "notebooks", "04_eda_visualizations.py")),
]

SEP = "=" * 65


def run_step(label: str, script: str) -> bool:
    print(f"\n{SEP}")
    print(f"  {label}")
    print(SEP)
    start = time.time()
    env = os.environ.copy()
    env["PYTHONIOENCODING"] = "utf-8"
    result = subprocess.run(
        [sys.executable, "-X", "utf8", script],
        cwd=ROOT,
        capture_output=False,
        env=env,
    )
    elapsed = time.time() - start
    if result.returncode == 0:
        print(f"\n  [OK] Completed in {elapsed:.1f}s")
        return True
    else:
        print(f"\n  [FAIL] FAILED  (exit code {result.returncode})")
        return False


def main():
    print(f"\n{'BLINKIT SALES ANALYSIS -- FULL PIPELINE':^65}")
    print(SEP)
    print(f"  Project root : {ROOT}")
    print(f"  Python       : {sys.version.split()[0]}")
    print(SEP)

    # Ensure output directories exist
    for d in ("screenshots", "reports", "data"):
        os.makedirs(os.path.join(ROOT, d), exist_ok=True)

    # Skip dataset generation if raw data already exists
    raw_path = os.path.join(ROOT, "data", "blinkit_raw_data.csv")
    if os.path.exists(raw_path):
        print(f"\n  [INFO] Raw data already exists -- skipping generation step")
        pipeline = PIPELINE[1:]  # skip step 1
    else:
        pipeline = PIPELINE

    total_start = time.time()
    success_count = 0
    failed = []

    for label, script in pipeline:
        if not os.path.exists(script):
            print(f"\n  [WARN] Script not found: {script}")
            failed.append(label)
            continue
        if run_step(label, script):
            success_count += 1
        else:
            failed.append(label)

    total_elapsed = time.time() - total_start

    print(f"\n{SEP}")
    print(f"  PIPELINE COMPLETE")
    print(SEP)
    print(f"  [PASS] Passed : {success_count}/{len(pipeline)}")
    if failed:
        print(f"  [FAIL] Failed : {', '.join(failed)}")
    print(f"  [TIME] Total  : {total_elapsed:.1f}s")
    print(f"\n  Charts     --> screenshots/  (12 PNG charts)")
    print(f"  Reports    --> reports/       (CSV + MD files)")
    print(f"  Clean data --> data/blinkit_cleaned_data.csv")
    print(SEP)


if __name__ == "__main__":
    main()
