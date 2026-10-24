---
title: Missing Values and Outliers: A Practical Guide
description: Finding, understanding and fixing missing values and outliers in pandas and scikit-learn, and the leakage trap most pipelines fall into.
date: 2026-10-25
tags: [Data Science, pandas, scikit-learn]
---

Every real dataset arrives with two problems before you have written a line of modelling code: values that are missing, and values that are technically present but look wrong. How you handle them decides more about your model than most hyperparameter searches will.

The good news is that neither problem needs a clever trick. It needs a short sequence of questions, asked in the right order: **what is missing or extreme, why, and what does the model need?** This guide works through both problems on one dataset, with the code for each step and the numbers it actually produces.

## The dataset

I'll use the Titanic passenger list that ships with seaborn. It is small enough to reason about, and it happens to contain every kind of mess this guide covers: a column that is mostly empty, a column with a meaningful gap, two stray blanks, and a fare column with a very long tail.

```python
import numpy as np
import pandas as pd
import seaborn as sns

df = sns.load_dataset("titanic")
df.shape
```

```output
(891, 15)
```

Everything below runs on pandas 3.1 and scikit-learn 1.9, but none of it depends on recent features.

## Part 1: Missing values

### Find them first

Before deciding anything, measure. Counts alone are misleading on a large table, so put the percentage next to each one.

```python
missing = (
    df.isna().sum().to_frame("missing")
    .assign(percent=lambda t: (t["missing"] / len(df) * 100).round(1))
    .query("missing > 0")
    .sort_values("missing", ascending=False)
)
missing
```

```output
             missing  percent
deck             688     77.2
age              177     19.9
embarked           2      0.2
embark_town        2      0.2
```

![Horizontal bar chart: deck is missing in 77.2% of rows, age in 19.9%, embarked and embark_town in 0.2% each.](/blog-images/missing-values-and-outliers/missing-share.svg "Four columns have gaps, and they are three different problems: one column that is mostly empty, one with a real gap, and two stray blanks.")

Those four columns look like one problem. They are three, and each gets a different answer.

### Ask why it is missing

The method you choose depends on *why* a value is absent. Statisticians sort missingness into three kinds, and the names are worth knowing because they map directly to decisions:

- **Missing completely at random (MCAR):** the gap has nothing to do with anything. A sensor dropped a packet. Deleting those rows loses data, but doesn't bias what's left.
- **Missing at random (MAR):** the gap depends on *other columns you have*. You can model around it, because the explanation is in the data.
- **Missing not at random (MNAR):** the gap depends on the missing value itself. People with high incomes skip the income question. No imputation fixes this cleanly; the missingness *is* information.

You can't prove which kind you have, but you can look for evidence. Check whether the gap moves with other columns:

```python
df["deck"].isna().groupby(df["pclass"]).mean().round(3)
```

```output
pclass
1    0.190
2    0.913
3    0.976
```

The deck is missing for 19% of first-class passengers and 98% of third-class ones. That is not random. The gap tracks ticket class, so filling it with "the most common deck" would invent cabins for people who almost certainly didn't have one on record.

Age shows a milder version of the same pattern:

```python
df["age"].isna().groupby(df["pclass"]).mean().round(3)
```

```output
pclass
1    0.139
2    0.060
3    0.277
```

```python
df.groupby(df["age"].isna())["survived"].mean().round(3)
```

```output
age
False    0.406
True     0.294
```

Passengers with no recorded age survived at 29%, against 41% for everyone else. Whatever caused the gap is related to the outcome you would be predicting. Keep that in mind; it comes back below.

### Option 1: Drop it

Deletion is the right call more often than people admit, but only at the right grain.

```python
len(df.dropna())                  # 182 rows survive, out of 891
len(df.dropna(subset=["age"]))    # 714
```

A blanket `dropna()` throws away 80% of the data because of one column. Drop the **column** when it is mostly empty and you can't recover its meaning (here, `deck`), and drop **rows** only when very few are affected and the gap looks random. The two missing `embarked` values qualify: two rows out of 891 is noise, whatever you do with them.

```python
df = df.drop(columns=["deck"])
```

### Option 2: Fill with a simple statistic

For a numeric column, the median is the safe default. It is not pulled around by extreme values, and it is always a value the column could plausibly hold. For a categorical column, use the most frequent value.

```python
print(f"skew {df['age'].skew():.2f}, mean {df['age'].mean():.1f}, median {df['age'].median():.1f}")
```

```output
skew 0.39, mean 29.7, median 28.0
```

Age is only slightly skewed, so the mean and median are close here; on a column like income they can be miles apart. With scikit-learn, the same thing is a `SimpleImputer`:

```python
from sklearn.impute import SimpleImputer

SimpleImputer(strategy="median")          # numeric columns
SimpleImputer(strategy="most_frequent")   # categorical columns
```

The cost of a single statistic is that every filled row gets the *same* value. Fill 177 ages with 28 and you have created a spike at 28 and shrunk the column's variance.

### Option 3: Fill within groups

You can do much better by filling from rows that resemble the missing one. Age varies a lot by class and sex, so a 3rd-class woman and a 1st-class man shouldn't receive the same guess:

```python
df.groupby(["pclass", "sex"])["age"].median()
```

```output
pclass  sex
1       female    35.0
        male      40.0
2       female    28.0
        male      30.0
3       female    21.5
        male      25.0
```

```python
age_filled = df["age"].fillna(
    df.groupby(["pclass", "sex"])["age"].transform("median")
)
```

`transform` returns a value for every row, aligned to the original index, which is what makes it a one-line fill. The guesses now range from 21.5 to 40 instead of sitting on a single number.

### Option 4: Let a model fill it

When several columns predict the missing one, a model can use all of them at once. scikit-learn ships two:

```python
from sklearn.experimental import enable_iterative_imputer  # noqa: F401
from sklearn.impute import IterativeImputer, KNNImputer

cols = ["age", "fare", "pclass", "sibsp", "parch"]
KNNImputer(n_neighbors=5).fit_transform(df[cols])
IterativeImputer(random_state=0).fit_transform(df[cols])
```

`KNNImputer` averages the five most similar passengers; `IterativeImputer` fits a regression for each column against the others and repeats until the estimates settle. On this data the imputed ages average 30.5 and 27.7 respectively, both close to the median, but now varying with each passenger's fare and family size. These are worth the extra complexity when the relationships are strong. When they aren't, they mostly add runtime.

### Keep the signal: flag what you filled

Remember that missing ages survived at a different rate. If you fill the gap and move on, the model can no longer see that a value was ever missing. Add an indicator column, so it can:

```python
imputer = SimpleImputer(strategy="median", add_indicator=True)
imputer.fit(df[["age"]]).get_feature_names_out()
```

```output
['age', 'missingindicator_age']
```

This is the most underused option in the toolkit. It costs one column, a model that doesn't need it can learn to ignore it, and it is the honest answer to data that might be missing *not* at random.

## The leakage trap

Every example above computed its statistic on the **whole** dataset. In a notebook that's harmless. In a model it's a leak: the median you fill the test set with was computed partly *from* the test set, so your evaluation has seen data it is supposed to be blind to. On a small or shifting dataset that is enough to make a model look better than it will perform.

The fix is structural, not a matter of being careful. Put the imputer inside a `Pipeline`, so it learns its statistics from the training fold only, every time:

```python
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import cross_val_score, train_test_split
from sklearn.pipeline import Pipeline, make_pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

df = sns.load_dataset("titanic")
X = df[["pclass", "sex", "age", "sibsp", "parch", "fare", "embarked"]]
y = df["survived"]
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

preprocess = ColumnTransformer([
    ("num", make_pipeline(
        SimpleImputer(strategy="median", add_indicator=True),
        StandardScaler(),
    ), ["age", "sibsp", "parch", "fare"]),
    ("cat", make_pipeline(
        SimpleImputer(strategy="most_frequent"),
        OneHotEncoder(handle_unknown="ignore"),
    ), ["pclass", "sex", "embarked"]),
])

model = Pipeline([
    ("prep", preprocess),
    ("clf", LogisticRegression(max_iter=1000)),
])

cross_val_score(model, X_train, y_train, cv=5).mean()   # 0.796
model.fit(X_train, y_train).score(X_test, y_test)        # 0.810
```

After fitting, the imputer's learned median age is 28.5, not the 28.0 of the full dataset. That half-year is the leak, made visible. Small here; not small on every dataset. With a pipeline, `cross_val_score` refits the imputer inside each fold automatically, and the same object fills new data in production with exactly the statistics it learned in training.

## Part 2: Outliers

### Look before you remove anything

An outlier is a value far from the rest. That's all the word means. It does **not** mean "wrong", and the most common mistake in this whole topic is treating the two as the same thing.

```python
df["fare"].describe().round(2)
```

```output
count    891.00
mean      32.20
std       49.69
min        0.00
25%        7.91
50%       14.45
75%       31.00
max      512.33
```

The mean is more than double the median, the maximum is more than sixteen times the upper quartile, and the skew is 4.79 (a symmetric column sits near 0). This column has a long right tail. The question is what's in it.

```python
df.nlargest(4, "fare")[["fare", "pclass", "embark_town", "alive"]]
```

```output
         fare  pclass  embark_town alive
258  512.3292       1    Cherbourg   yes
679  512.3292       1    Cherbourg   yes
737  512.3292       1    Cherbourg   yes
27   263.0000       1  Southampton    no
```

Three first-class passengers paid exactly the same top fare, boarded at the same port, and all survived. That's not a typo, it's a booking. Deleting those rows would delete real, informative passengers. There are also 15 fares of exactly zero, which is a more interesting question: crew, or a data-entry default? A spike at 0 deserves a look before any rule touches it.

### The IQR rule

The interquartile range (IQR) is the spread of the middle half of the data. Anything more than 1.5 × IQR beyond the quartiles is flagged. It is what a box plot's whiskers draw.

```python
q1, q3 = df["fare"].quantile([0.25, 0.75])
iqr = q3 - q1
lower, upper = q1 - 1.5 * iqr, q3 + 1.5 * iqr
outliers = df[(df["fare"] < lower) | (df["fare"] > upper)]

print(f"q1 {q1:.2f}, q3 {q3:.2f}, iqr {iqr:.2f}")
print(f"lower {lower:.2f}, upper {upper:.2f}")
print(f"{len(outliers)} flagged ({len(outliers) / len(df):.1%} of passengers)")
```

```output
q1 7.91, q3 31.00, iqr 23.09
lower -26.72, upper 65.63
116 flagged (13.0% of passengers)
```

Two things stand out. The lower fence is negative, so on a column that can't go below zero, the rule can only ever flag the top. And 104 of the 116 flagged fares are first-class. The rule hasn't found errors; it has found the first-class cabin.

### The z-score rule

The z-score measures distance from the mean in standard deviations, and |z| > 3 is the usual cut-off:

```python
z = (df["fare"] - df["fare"].mean()) / df["fare"].std()
(z.abs() > 3).sum()
```

```output
20
```

Only 20, and the lowest flagged fare is 211.34. The z-score assumes a roughly symmetric, bell-shaped column, and fare is neither. The extreme values inflate the very standard deviation used to judge them, so the cut-off lands at 181.3 and most of the tail hides underneath it.

![Histogram of fares, heavily right-skewed. A dashed orange line marks the IQR fence at 65.6; a dashed black line marks the z = 3 cut-off at 181.3.](/blog-images/missing-values-and-outliers/fare-cutoffs.svg "Same column, two rules, very different answers: 116 fares sit above the IQR fence, but only 20 above the z-score cut-off.")

For skewed data there is a robust variant, the *modified* z-score, built on the median and the median absolute deviation (MAD) instead of the mean and standard deviation:

```python
med = df["fare"].median()
mad = (df["fare"] - med).abs().median()
modified_z = 0.6745 * (df["fare"] - med) / mad
(modified_z.abs() > 3.5).sum()
```

```output
160
```

It flags 160, *more* than the IQR rule, because half of all fares sit within 6.90 of the median, so by that yardstick the tail is enormous. Three methods, three answers: 20, 116, 160. That's the real lesson. **An outlier rule is a definition you choose, not a fact you discover**, so choose it knowing what the column looks like.

### Several columns at once

Single-column rules miss rows that are unusual only in combination: a young passenger travelling alone on a family-sized fare, for instance. `IsolationForest` scores each row by how easy it is to isolate from the rest:

```python
from sklearn.ensemble import IsolationForest

cols = ["age", "fare", "sibsp", "parch"]
X = df[cols].fillna(df[cols].median())
iso = IsolationForest(contamination=0.02, random_state=42).fit(X)
flagged = df[iso.predict(X) == -1]
```

With `contamination=0.02` it flags 18 rows, among them the three top fares and a cluster of 263 fares belonging to large families travelling together. Note that `contamination` is *you* deciding that 2% of the data is anomalous. It's a dial, not a measurement.

### What to do with them

Once you know what an outlier is, there are four honest options:

| Situation | What to do | On this data |
| --- | --- | --- |
| It's an error (impossible value, unit mix-up) | Fix it if you can, otherwise remove it | Check the 15 zero fares first |
| It's real, and the model is sensitive to scale | Transform the column | `np.log1p` takes skew from 4.79 to 0.39 |
| It's real, but too extreme to learn from | Cap it at a fence | Capping at 65.63 takes skew to 1.08 |
| It's real and it matters | Keep it, and use a model that copes | Tree models split on order, not distance |

```python
df["fare_log"] = np.log1p(df["fare"])                 # skew 0.39
df["fare_capped"] = df["fare"].clip(upper=upper)      # skew 1.08
```

A log transform is usually the best first move for a money-like column: it keeps every row and every ordering, and only compresses the distances. `log1p` rather than `log` because it handles the zero fares. Capping is blunter: every fare above 65.63 becomes 65.63, so a 70 and a 512 become indistinguishable. Winsorizing at the 1st and 99th percentiles is gentler still and barely helps here (skew 3.11), because the problem isn't the top 1%, it's the whole tail.

Whatever you choose, the leakage rule from Part 1 applies again. Fences, percentiles and means are statistics, so compute them on training data only, inside the pipeline.

## A checklist

1. **Measure** what's missing, as a percentage, and look at what's extreme before touching anything.
2. **Ask why.** Check whether gaps and extremes move with other columns. That decides everything after.
3. **Drop columns** that are mostly empty and unrecoverable; drop rows only when they're few and the gap looks random.
4. **Impute** with the median, a group median, or a model, and **add an indicator** whenever missingness might carry signal.
5. **Treat outliers as data until proven otherwise.** Transform before you cap, and cap before you delete.
6. **Fit every statistic inside a pipeline**, so nothing about the test set leaks into training.

None of this is glamorous. But a model is only ever as honest as the data it was trained on, and these two steps are where that honesty is won or lost.
