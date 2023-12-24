import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


function randomShuffle(unshuffled) {
    let shuffled = unshuffled
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
    return shuffled;
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(unshuffled) {
    return unshuffled[randomInt(0, unshuffled.length - 1)];
}

function setDifference(setA, setB) {
    let _difference = new Set(setA);
    for (const elem of setB) {
        _difference.delete(elem);
    }
    return _difference;
}

function deepCloneLLS(list_of_lists_of_sets) {
    let r_list_of_lists_of_sets = [];
    for (let list_of_sets of list_of_lists_of_sets) {
        let r_list_of_sets = [];
        for (let set of list_of_sets) {
            let r_set = new Set();
            for (let x of set) {
                r_set.add(x);
            }
            r_list_of_sets.push(r_set);
        }
        r_list_of_lists_of_sets.push(r_list_of_sets);
    }
    return r_list_of_lists_of_sets;
}

function isDeepEqualLLS(list_of_lists_of_sets_1, list_of_lists_of_sets_2) {
    let equals = true;
    for (let i = 0, n = list_of_lists_of_sets_1.length; i < n && equals; ++i) {
        let list_of_sets_1 = list_of_lists_of_sets_1[i];
        let list_of_sets_2 = list_of_lists_of_sets_2[i];
        for (let j = 0, m = list_of_sets_1.length; j < m && equals; ++j) {
            let set_1 = list_of_sets_1[j];
            let set_2 = list_of_sets_2[j];
            for (let x of set_1) {
                if (set_2.has(x) === false) {
                    equals = false;
                    break;
                }
            }
        }
    }
    return equals;
}
function generateRiddle(
    table,
    level,
    minimal_conditions = false,
    max_seconds_for_minimizing = 0,
    tries = 10,
    max_solutions = 1) {
    if (level < 1 || level > 20) {
        return null;
    }
    let table_wo_left = table.map(row => row.slice(1, row.length));
    let n_attributes = table_wo_left.length;
    let m_objects = table_wo_left[0].length;
    let changed = true;
    if (level >= 19 && m_objects === 2) {
        return null;
    }
    else if (m_objects <= 1 || n_attributes <= 0 || tries <= 0) {
        return null;
    }
    let max_milliseconds_for_minimizing = max_seconds_for_minimizing * 1000;
    let center = Math.floor(m_objects / 2);
    let except_flag = true;
    let rules_for_relations = [
        [2, (j1, j2) => j1 === j2, ['{0}:{1} == {2}:{3}', '{2}:{3} == {0}:{1}']],
        [2, (j1, j2) => j1 === j2, ['{0}:{1} == {2}:{3}', '{2}:{3} == {0}:{1}']],
        [2, (j1, j2) => j1 === j2 - 1, ['{0}:{1} is on the left of {2}:{3}']],
        [2, (j1, j2) => j1 === j2 + 1, ['{0}:{1} is on the right of {2}:{3}']],
        [1, (j1) => j1 === 0, ['{0}:{1} is on the far left']],
        [1, (j1, last_index = m_objects - 1) => j1 === last_index,
            ['{0}:{1} is on the far right']],
    ];
    if (m_objects % 2 !== 0) {
        rules_for_relations.push(...[
            [1, (j1, mid = center) => j1 === mid, ['{0}:{1} is in the middle']]
        ]);
    }
    if (level >= 2) {
        rules_for_relations.push(...[
            [3, (j1, j2, j3) => j2 + 1 === j1 && j1 === j3 - 1 || j3 + 1 === j1 && j1 === j2 - 1,
                ['{0}:{1} is between {2}:{3} and {4}:{5}', '{0}:{1} is between {4}:{5} and {2}:{3}']],
        ]);
    }
    if (level >= 3) {
        rules_for_relations.push(...[
            [2, (j1, j2) => j1 === j2 - 1 || j1 === j2 + 1,
                ['{0}:{1} is on the left or right of {2}:{3}']],
            [1, (j1, last_index = m_objects - 1) => j1 === 0 || j1 === last_index,
                ['{0}:{1} is on the far left or far right']],
        ]);
    }
    if (level >= 4) {
        rules_for_relations.push(...[
            [1, (j1) => (j1 + 1) % 2 !== 0, ['{0}:{1} is in an odd position']],
            [1, (j1) => (j1 + 1) % 2 === 0, ['{0}:{1} is in an even position']],
        ]);
    }
    if (level >= 5) {
        rules_for_relations.push(...[
            [2, (j1, j2) => j1 < j2, ['{0}:{1} is somewhere to the left of {2}:{3}']],
            [2, (j1, j2) => j1 > j2, ['{0}:{1} is somewhere to the right of {2}:{3}']],
        ]);
    }
    if (level >= 6) {
        rules_for_relations.push(...[
            [2, (j1, j2) => j1 !== j2, ['{0}:{1} != {2}:{3}', '{2}:{3} != {0}:{1}'], except_flag],
        ]);
    }
    if (level >= 7) {
        rules_for_relations.push(...[
            [3, (j1, j2, j3) => j2 < j1 && j1 < j3 || j3 < j1 && j1 < j2,
                ['{0}:{1} is somewhere between {2}:{3} and {4}:{5}',
                    '{0}:{1} is somewhere between {4}:{5} and {2}:{3}']],
        ]);
    }
    if (level >= 8) {
        rules_for_relations.push(...[
            [2, (j1, j2) => j1 >= j2, ['{0}:{1} is not to the left of {2}:{3}']],
            [2, (j1, j2) => j1 <= j2, ['{0}:{1} is not to the right of {2}:{3}']],
        ]);
    }
    if (level >= 9) {
        rules_for_relations.push(...[
            [2, (j1, j2) => j1 % 2 !== j2 % 2,
                ['{0}:{1} and {2}:{3} have different parity positions',
                    '{2}:{3} and {0}:{1} have different parity positions'], except_flag],
            [2, (j1, j2) => j1 % 2 === j2 % 2,
                ['{0}:{1} and {2}:{3} have the same parity positions',
                    '{2}:{3} and {0}:{1} have the same parity positions'], except_flag],
        ]);
    }
    if (level >= 10) {
        rules_for_relations.push(...[
            [3, (j1, j2, j3) => (j1 === j2 && j1 !== j3) || (j1 !== j2 && j1 === j3),
                ['{0}:{1} == {2}:{3} or {0}:{1} == {4}:{5}, but not both',
                    '{0}:{1} == {4}:{5} or {0}:{1} == {2}:{3}, but not both'], except_flag],
            [3, (j1, j2, j3) => (j1 === j2 && j2 !== j3) || (j1 !== j2 && j2 === j3),
                ['{0}:{1} == {2}:{3} or {2}:{3} == {4}:{5}, but not both',
                    '{2}:{3} == {4}:{5} or {0}:{1} == {2}:{3}, but not both'], except_flag],
        ]);
    }
    if (level >= 11) {
        rules_for_relations.push(...[
            [3, (j1, j2, j3) => j1 === j2 || j1 === j3,
                ['{0}:{1} == {2}:{3} or {0}:{1} == {4}:{5} or both',
                    '{0}:{1} == {4}:{5} or {0}:{1} == {2}:{3} or both'], except_flag],
            [3, (j1, j2, j3) => j1 === j2 || j2 === j3,
                ['{0}:{1} == {2}:{3} or {2}:{3} == {4}:{5} or both',
                    '{2}:{3} == {4}:{5} or {0}:{1} == {2}:{3} or both'], except_flag],
        ]);
    }
    if (level >= 12) {
        rules_for_relations.push(...[
            [3, (j1, j2, j3) => j1 !== j2 || j1 !== j3,
                ['{0}:{1} != {2}:{3} or {0}:{1} != {4}:{5} or both',
                    '{0}:{1} != {4}:{5} or {0}:{1} != {2}:{3} or both'], except_flag],
            [3, (j1, j2, j3) => j1 !== j2 || j2 !== j3,
                ['{0}:{1} != {2}:{3} or {2}:{3} != {4}:{5} or both',
                    '{2}:{3} != {4}:{5} or {0}:{1} != {2}:{3} or both'], except_flag],
        ]);
    }
    if (level >= 13) {
        rules_for_relations.pop(0); // pop '=='
    }
    if (level >= 14) {
        rules_for_relations.pop(0); // pop 'is on the left of'
        rules_for_relations.pop(0); // pop 'is on the right of'
    }
    if (level >= 15) {
        rules_for_relations.pop(0); // pop 'is on the far left'
        rules_for_relations.pop(0); // pop 'is on the far right'
        if (m_objects % 2 !== 0) {
            rules_for_relations.pop(0); // pop 'is in the middle'
        }
    }
    if (level >= 16) {
        rules_for_relations.pop(0); // pop 'is between'
    } if (level >= 17) {
        rules_for_relations.pop(0); // pop 'is on the left or right of'
        rules_for_relations.pop(0); // pop 'is on the far left or far right'
    } if (level >= 18) {
        rules_for_relations.pop(0); // pop 'is in an odd position'
        rules_for_relations.pop(0); // pop 'is in an even position'
    } if (level >= 19) {
        rules_for_relations.pop(0); // pop 'is somewhere to the left of'
        rules_for_relations.pop(0); // pop 'is somewhere to the right of'
    } if (level >= 20) {
        rules_for_relations.pop(0); // pop '!='
    }
    let is_minimized = false;
    let time_elapsed = false;
    let min_solutions = [];
    let min_relations = null;
    let relations = [];
    let solutions = [];
    while (true) {
        let ranges = [];
        table_wo_left.forEach(item => {
            let rng = [];
            item.forEach(_ => {
                rng.push(new Set(item));
            });
            ranges.push(rng);
        });
        relations = [];
        solutions = [];
        let fail = false;
        while (fail === false) {
            let needs_clarification = [];
            let no_solutions = false;
            let solved = true;
            for (let i = 0, n = ranges.length; i < n; ++i) {
                let rng = ranges[i];
                for (let j = 0, m = rng.length; j < m; ++j) {
                    let rs = rng[j];
                    if (rs.size === 0) {
                        no_solutions = true;
                        solved = false;
                        break;
                    }
                    else if (rs.size > 1) {
                        solved = false;
                        needs_clarification.push([i, j]);
                    }
                }
                if (no_solutions) {
                    break;
                }
            }
            solutions = [ranges];
            if (solved || min_relations != null && relations.length >= min_relations.length) {
                tries -= 1;
                if (min_relations == null || relations.length < min_relations.length) {
                    min_relations = relations;
                    min_solutions = solutions;
                }
                if (tries > 0) {
                    fail = true;
                    continue;
                }
            }
            if (tries <= 0) {
                relations = min_relations;
                solutions = min_solutions;
                if (minimal_conditions === false) {
                    break;
                }
                let number_of_relations_min = relations.length;
                let number_of_relations_before = relations.length;
                var start_time = window.performance.now();
                let main_q = [relations];
                while (main_q.length > 0) {
                    let current_relations = main_q.pop();
                    for (let k = 0, n = current_relations.length;
                        k < n; ++k) {
                        let new_ranges = [];
                        table_wo_left.forEach(item => {
                            let rng = [];
                            item.forEach(_ => {
                                rng.push(new Set(item));
                            });
                            new_ranges.push(rng);
                        });
                        let new_relations = current_relations.slice();
                        new_relations.pop(k);
                        let changed = true;
                        while (changed) {
                            changed = updateRanges(new_relations, new_ranges);
                        }
                        let possible_solutions = [];
                        let q = [new_ranges];
                        while (q.length > 0) {
                            let current_ranges = q.pop();
                            no_solutions = false;
                            solved = true;
                            for (let i = 0, n = current_ranges.length; i < n; ++i) {
                                let rng = current_ranges[i];
                                for (let j = 0, m = rng.length; j < m; ++j) {
                                    let rs = rng[j];
                                    if (rs.size === 0) {
                                        no_solutions = true;
                                        solved = false;
                                        break;
                                    }
                                    else if (rs.size > 1) {
                                        solved = false;
                                    }
                                }
                                if (no_solutions) {
                                    break;
                                }
                            }
                            if (no_solutions) {
                                continue;
                            }
                            if (solved) {
                                if (possible_solutions.findIndex(x => isDeepEqualLLS(x, current_ranges)) === -1) {
                                    possible_solutions.push(deepCloneLLS(current_ranges));
                                    if (possible_solutions.length > max_solutions) {
                                        break;
                                    }
                                }
                                continue;
                            }
                            for (let i = 0, n = current_ranges.length; i < n; ++i) {
                                let founded = false;
                                let rng = current_ranges[i];
                                for (let j = 0, m = rng.length; j < m; ++j) {
                                    let rs = rng[j];
                                    if (rs.size > 1) {
                                        founded = true;
                                        rs.forEach(r => {
                                            let new_ranges = deepCloneLLS(current_ranges);
                                            new_ranges[i][j] = new Set([r]);
                                            changed = true;
                                            while (changed) {
                                                changed = updateRanges(new_relations, new_ranges);
                                            }
                                            q.push(new_ranges);
                                        });
                                        break;
                                    }
                                }
                                if (founded) {
                                    break;
                                }
                            }
                        }
                        if (1 <= possible_solutions.length && possible_solutions.length <= max_solutions) {
                            let number_of_relations_after = new_relations.length;
                            if (number_of_relations_min > number_of_relations_after) {
                                number_of_relations_min = number_of_relations_after;
                                relations = new_relations;
                                solutions = possible_solutions;
                                main_q.push(new_relations);
                            }
                        }
                        var finish_time = window.performance.now();
                        if (max_milliseconds_for_minimizing != null &&
                            finish_time >= start_time + max_milliseconds_for_minimizing) {
                            time_elapsed = true;
                            break;
                        }
                    }
                    if (time_elapsed) {
                        break;
                    }
                }
                is_minimized = number_of_relations_min < number_of_relations_before ||
                    time_elapsed === false;
                break;
            }
            if (no_solutions || needs_clarification.length === 0) {
                fail = true;
                continue;
            }
            let itemIndex = randomInt(0, needs_clarification.length - 1);
            let item = needs_clarification.pop(itemIndex);
            let i = item[0], j = item[1];
            let next2_i = null, next2_j = null;
            if (level >= 2 && needs_clarification.length > 0) {
                let next2_item = randomChoice(needs_clarification);
                next2_i = next2_item[0];
                next2_j = next2_item[1];
            }
            let neighbours = [];
            let right_neighbours = [];
            for (let dj = -1; dj <= 1; ++dj) {
                if (j + dj < 0 || j + dj >= m_objects) {
                    continue;
                }
                for (let new_i = 0; new_i < n_attributes; ++new_i) {
                    if (new_i === i && dj === 0) {
                        continue;
                    }
                    let new_item = [new_i, j + dj];
                    neighbours.push(new_item);
                    if (level >= 2 && dj === 1) {
                        right_neighbours.push(new_item);
                    }
                }
            }
            if (neighbours.length === 0) {
                continue;
            }
            let next_item = randomChoice(neighbours);
            let next_i = next_item[0];
            let next_j = next_item[1];
            if (level >= 2 && next2_i == null && right_neighbours.length > 0) {
                let next2_item = randomChoice(right_neighbours);
                next2_i = next2_item[0];
                next2_j = next2_item[1];
            }
            let permutations3 = next2_i != null ? [
                [[i, j], [next_i, next_j], [next2_i, next2_j]], [[i, j], [next2_i, next2_j], [next_i, next_j]],
                [[next_i, next_j], [i, j], [next2_i, next2_j]], [[next_i, next_j], [next2_i, next2_j], [i, j]],
                [[next2_i, next2_j], [i, j], [next_i, next_j]], [[next2_i, next2_j], [next_i, next_j], [i, j]]
            ] : [];
            let permutations2 = next2_i != null ? [
                [[i, j], [next_i, next_j]], [[next_i, next_j], [next2_i, next2_j]], [[i, j], [next2_i, next2_j]],
                [[next_i, next_j], [i, j]], [[next2_i, next2_j], [next_i, next_j]], [[next2_i, next2_j], [i, j]],
            ] : [
                [[i, j], [next_i, next_j]], [[next_i, next_j], [i, j]]
            ];
            let possible_variants = [];
            rules_for_relations.forEach(arg => {
                let n_args = arg[0];
                let cmp_function = arg[1];
                let str_variants = arg[2];
                let except_flag = arg.length >= 4 ? arg[3] : null;
                if (n_args === 3) {
                    permutations3.forEach(items => {
                        let ti = items[0][0];
                        let tj = items[0][1];
                        let t_next_i = items[1][0];
                        let t_next_j = items[1][1];
                        let t_next2_i = items[2][0];
                        let t_next2_j = items[2][1];
                        if (except_flag === true &&
                            (ti === t_next_i ||
                                ti === t_next2_i ||
                                t_next_i === t_next2_i)) {
                            return;
                        }
                        if (cmp_function(tj, t_next_j, t_next2_j)) {
                            possible_variants.push([items, cmp_function, randomChoice(str_variants)]);
                        }
                    });
                }
                else if (n_args === 2) {
                    permutations2.forEach(items => {
                        let ti = items[0][0];
                        let tj = items[0][1];
                        let t_next_i = items[1][0];
                        let t_next_j = items[1][1];
                        if (except_flag === true && ti === t_next_i) {
                            return;
                        }
                        if (cmp_function(tj, t_next_j)) {
                            possible_variants.push([items, cmp_function, randomChoice(str_variants)]);
                        }
                    });
                }
                else if (n_args === 1 && cmp_function(j)) {
                    possible_variants.push([[[i, j]], cmp_function, randomChoice(str_variants)]);
                }
            });
            if (possible_variants.length === 0) {
                continue;
            }
            let variant = randomChoice(possible_variants);
            let list_of_ij = variant[0];
            let cmp_function = variant[1];
            let string_format = variant[2];
            let list_for_format = [], ins = [], wns = [];
            list_of_ij.forEach(ij => {
                let i = ij[0], j = ij[1];
                list_for_format.push(table[i][0]);
                list_for_format.push(table_wo_left[i][j]);
                ins.push(i);
                wns.push(table_wo_left[i][j]);
            });
            relations.push([ins, wns, cmp_function, formatPremise(list_for_format, string_format)]);
            changed = true;
            while (changed) {
                changed = updateRanges(relations, ranges);
            }
        }
        if (!fail) {
            if (minimal_conditions && is_minimized === false && time_elapsed === false) {
                continue;
            }
            break;
        }
    }
    let premises = relations.map(t => t[t.length - 1]);
    randomShuffle(premises);
    return [solutions, premises];
}


function setIntersection(setA, setB) {
    let _intersection = new Set();
    for (const elem of setB) {
        if (setA.has(elem)) {
            _intersection.add(elem);
        }
    }
    return _intersection;
}

function formatPremise(list_for_format, string_format) {
    let i = 0;
    while (true) {
        let substr = '{' + i + '}';
        let index = string_format.indexOf(substr);
        if (index >= 0) {
            string_format = string_format.replace(substr, list_for_format[i]);
        }
        else {
            if (++i >= list_for_format.length) {
                break;
            }
        }
    }
    return string_format;
}
function updateRange(wns, rns, cmp) {
    let changed = false;
    rns.forEach(rn => {
        let classified_words = new Set();
        rn.forEach((set_of_words) => {
            if (set_of_words.size === 1) {
                classified_words.add(set_of_words.keys().next().value);
            }
        });
        let word_to_cols = {};
        rn.forEach((set_of_words, n_col) => {
            if (set_of_words.size !== 1) {
                let prev_length = set_of_words.size;
                set_of_words = setDifference(set_of_words, classified_words);
                rn[n_col] = set_of_words;
                changed |= prev_length != set_of_words.size;
                set_of_words.forEach(word => {
                    if (word_to_cols[word] == undefined) {
                        word_to_cols[word] = new Set();
                    }
                    word_to_cols[word].add(n_col);
                });
            }
        });
        for (const word in word_to_cols) {
            let cols = word_to_cols[word];
            if (cols.size === 1) {
                let x = rn[cols.keys().next().value];
                if (x.size != 1) {
                    x.clear();
                    x.add(word);
                    changed = true;
                }
            }
        }
    });
    let new_rns = [];
    for (let i = 0, n = wns.length; i < n; ++i) {
        let wn = wns[i];
        let rn = rns[i];
        let new_rn = [];
        for (let xs of rn) {
            let new_set = new Set();
            for (let x of xs) {
                if (x != wn) {
                    new_set.add(x);
                }
            }
            new_rn.push(new_set);
        }
        new_rns.push(new_rn);
    }

    let pairs = [];
    for (let i = 0, n = wns.length; i < n; ++i) {
        let wn = wns[i];
        let rn = rns[i];
        let new_pairs = [];
        let break_condition = true;
        rn.forEach((setn, cn) => {
            if (setn.has(wn)) {
                break_condition = false;
                if (pairs.length === 0) {
                    pairs = [[]];
                }
                pairs.forEach(v => {
                    new_pairs.push([...v, cn]);
                });
            }
        });
        pairs = new_pairs;
        if (break_condition) {
            break;
        }
    }
    pairs.forEach(pair => {
        if (cmp(...pair)) {
            for (let i = 0, n = new_rns.length; i < n; ++i) {
                let nrn = new_rns[i];
                let cn = pair[i];
                let wn = wns[i];
                nrn[cn].add(wn);
            }
        }
    });
    for (let i = 0, n = rns.length; i < n; ++i) {
        let rn = rns[i];
        let new_rn = new_rns[i];
        for (let j = 0, m = rn.length; j < m; ++j) {
            let prev_length = rn[j].size;
            rn[j] = setIntersection(rn[j], new_rn[j]);
            changed |= prev_length != rn[j].size;
        }
    }
    return changed;
}

function updateRanges(relations, ranges) {
    let changed = false;
    relations.forEach(relation => {
        let [ins, wns, callable_object, _] = relation;
        changed |= updateRange(
            wns,
            ins.map(i => ranges[i]),
            callable_object);
    });
    return changed;
}

let kinds_dict = {
    "Nationality": [
        "american", "argentine", "australian", "brazilian", "british",
        "canadian", "chinese", "colombian", "dutch", "egyptian",
        "french", "german", "indian", "indonesian", "italian",
        "japanese", "malaysian", "mexican", "nigerian", "pakistani",
        "polish", "russian", "spanish", "thai", "turkish",
    ],
    "Food": [
        "apple", "apricot", "artichoke", "asparagus", "avocado",
        "banana", "blueberry", "broccoli", "cabbage", "carrot",
        "cauliflower", "cherry", "corn", "cranberry", "cucumber",
        "eggplant", "garlic", "grapefruit", "grapes", "kale",
        "kiwi", "lemon", "lettuce", "lime", "mango",
        "nectarine", "onion", "orange", "papaya", "peach",
        "pear", "peas", "pepper", "pineapple", "plum",
        "pomegranate", "potato", "pumpkin", "radish", "raspberry",
        "spinach", "strawberry", "tomato", "watermelon", "zucchini",
    ],
    "Pet": [
        "bird", "cat", "chinchilla", "dog", "ferret",
        "fish", "frog", "goat", "goldfish", "guinea-pig",
        "hamster", "hedgehog", "horse", "lizard", "mouse",
        "pony", "rabbit", "rat", "snake", "turtle",
    ],
    "Job": [
        "accountant", "analyst", "architect", "bartender", "chef",
        "coach", "dancer", "designer", "doctor", "dressmaker",
        "electrician", "engineer", "entrepreneur", "firefighter", "fisherman",
        "freelancer", "journalist", "lawyer", "librarian", "manager",
        "mechanic", "musician", "nurse", "paramedic", "photographer",
        "pilot", "police-officer", "project-manager", "scientist", "security-guard",
        "social-worker", "software-developer", "teacher", "videographer", "writer",
    ],
    "Beverage": [
        "7up", "almond-milk", "coffee", "cola", "fanta",
        "hot-chocolate", "iced-tea", "juice", "lemonade", "milk",
        "mirinda", "soy-milk", "sprite", "tea", "water",
    ],
    "Transport": [
        "airplane", "bike", "boat", "bus", "car",
        "helicopter", "jet-ski", "motorbike", "quad-bike", "roller",
        "scooter", "ship", "skateboard", "snowmobile",
        "subway", "taxi", "train", "tram", "trike", "van",
    ],
    "Music-Genre": [
        "ambient", "blues", "classical", "country", "d&b",
        "disco", "dubstep", "electronic", "folk", "funk",
        "gospel", "hip-hop", "house", "indie", "jazz",
        "metal", "pop", "punk", "r&b", "reggae",
        "rock", "salsa", "soul", "techno", "trance",
    ],
    "Movie-Genre": [
        "action", "adventure", "animation", "comedy", "crime",
        "disaster", "documentary", "drama", "epic", "family",
        "fantasy", "horror", "martial-arts", "musical", "mystery",
        "romance", "satire", "scientific", "sports", "spy",
        "superhero", "thriller", "time-travel", "western", "zombie",
    ],
    "Sport": [
        "badminton", "baseball", "basketball", "biathlon", "climbing",
        "cricket", "cycling", "golf", "handball", "ice-hockey",
        "lacrosse", "parkour", "rowing", "rugby", "sailing",
        "skateboarding", "skiing", "snowboarding", "soccer", "surfing",
        "swimming", "tennis", "volleyball", "water-polo", "weightlifting",
    ],
    "Hobby": [
        "baking", "board-games", "camping", "card-games", "chess",
        "collecting", "cooking", "dancing", "drawing", "filmmaking",
        "fishing", "gardening", "hiking", "magic-tricks", "photography",
        "puzzles", "reading", "rock-climbing", "singing", "skydiving",
        "sudoku", "traveling", "video-games", "woodworking", "writing",
    ]
};
let kinds = Array.from(Object.keys(kinds_dict));
let chosenKinds = randomShuffle(kinds).slice(0, 3).sort();

let table = [];
chosenKinds.forEach(kind => {
    let first = [kind];
    let other = randomShuffle(kinds_dict[kind]).slice(0, 4);
    let row = [kind], sortedVars = other.slice().sort();
    for (let i = 0; i < 4; ++i) {
        row.push(sortedVars);
    }
    table.push(first.concat(other));
});

console.log(generateRiddle(table, 6, true))


const Murdle = ({socket}) => {
  const navigate = useNavigate();
  const [solution, setSolution] = useState([-1,-1,-1]);
  const [value1, setValue1] = useState(" ");
  const [value2, setValue2] = useState(" ");
  const [value3, setValue3] = useState(" ");
  const embed = useRef(); // We use a ref instead of state to avoid rerenders.
  
  const handleReady = (e) => {
    embed.current = e;
  };

  function onCodeInput(number,input) {
    let myvalue = input.target.value;
    if (myvalue.length >= 2) {
      myvalue =  myvalue.charAt(1)
    }
    switch (number) {
      case 0:
        setValue1(myvalue);
        break;
      case 1:
        setValue2(myvalue);
        break;
      case 2:    
        setValue3(myvalue);
        break;
    
      default:
        break;
    }
    solution[number] = +myvalue;
    setSolution(solution);
      
    socket.emit("solution", solution);


}


  return (
    <>
    <div className="lock-animation" id="lockAnimation">
        <div className="lock-base">
            <input type="number" id="guess1" value={value1} onInput={(e) => onCodeInput(0, e)} autoFocus="autofocus" placeholder="0"/>
            <input type="number" id="guess2" value={value2} onInput={(e) => onCodeInput(1, e)} autoFocus="autofocus" placeholder="0"/>
            <input type="number" id="guess3" value={value3} onInput={(e) => onCodeInput(2, e)} autoFocus="autofocus" placeholder="0"/>
        </div>
    </div> 
    </>
  );
};

export default Murdle;
