namespace SPO_LR2
{
    public class Lex
    {
        public int id;
        public int lexType;
        public string val;
        public List<Lex> lexes = new List<Lex>();

        public Lex(int _id, int _lex, string _val)
        {
            id = _id;
            lexType = _lex;
            val = _val;
        }

        public Lex(int _id, int _lex, string _val, List<Lex> _lexes)
        {
            id = _id;
            lexType = _lex;
            val = _val;
            lexes = _lexes;
        }
    }
}

namespace SPO_LR3
{
    public class SntxsAnalyst
    {
        //0 - неопределено; 1 - идентификатор; 2 - константа; 3 - логическая операция; 4 - знак присвоения; 5 - разделитель
        List<Lex> lexemes = new List<Lex>();
        List<List<Lex>> lexemesRows = new List<List<Lex>>();
        List<string> chains = new List<string>();
        List<List<Lex>> resultRows = new List<List<Lex>>();
        List<List<string>> resultRules = new List<List<string>>();
        static List<Lex> rule1 = new List<Lex>() { new Lex(-1, 1, "E"), new Lex(-1, 4, ":="), new Lex(-1, 1, "E"), new Lex(-1, 5, ";") };
        static List<Lex> rule2 = new List<Lex>() { new Lex(-1, 1, "E"), new Lex(-1, 3, "or"), new Lex(-1, 1, "E") };
        static List<Lex> rule3 = new List<Lex>() { new Lex(-1, 1, "E"), new Lex(-1, 3, "xor"), new Lex(-1, 1, "E") };
        static List<Lex> rule4 = new List<Lex>() { new Lex(-1, 1, "E") };
        static List<Lex> rule5 = new List<Lex>() { new Lex(-1, 1, "E"), new Lex(-1, 3, "and"), new Lex(-1, 1, "E") };
        static List<Lex> rule6 = new List<Lex>() { new Lex(-1, 1, "E") };
        static List<Lex> rule8 = new List<Lex>() { new Lex(-1, 5, "("), new Lex(-1, 1, "E"), new Lex(-1, 5, ")") };
        static List<Lex> rule7 = new List<Lex>() { new Lex(-1, 3, "not"), new Lex(-1, 5, "("), new Lex(-1, 1, "E"), new Lex(-1, 5, ")") };
        static List<Lex> rule9 = new List<Lex>() { new Lex(-1, 1, "alpha") };
        readonly int[,] ruleTable =
        {
            {0,1,1,1,1,0,0,1,0,3 }, //a
            {0,0,0,0,0,0,0,0,1,0 }, //;
            {2,1,1,1,0,2,2,1,0,0 }, //or
            {2,1,1,1,2,2,2,1,0,0 }, //xor
            {2,1,1,1,1,2,2,1,0,0 }, //and
            {0,0,0,0,0,0,3,0,0,0 }, //not
            {2,0,2,2,2,2,2,3,0,0 }, //(
            {0,1,1,1,1,0,0,1,0,0 }, //)
            {2,0,0,0,0,0,0,0,0,0 }, //PustK
            {2,3,2,2,2,2,2,0,0,0 } // :=
        };
        List<List<Lex>> grammarList = new List<List<Lex>>()
        {
            rule1, rule2, rule3, rule4, rule5, rule6, rule7, rule8, rule9
        };

        enum PositionRules { Left, Right, Equivalent, Nothing };


        public List<List<Lex>> LexemesRows { get => lexemesRows; }
        public List<string> Chains { get => chains; }
        public List<List<Lex>> ResultRows { get => resultRows; }
        public List<List<string>> ResultRules { get => resultRules; }

        public SntxsAnalyst(List<Lex> lexemesLA)
        {
            lexemes.AddRange(lexemesLA);
            Init();
        }
        private void Init()
        {
            List<Lex> lexes = new List<Lex>();
            int k = 0;
            foreach(Lex lex in lexemes)
            {

                lexes.Add(lex);
                if (lex.val == ";")
                {

                    lexemesRows.Add(new List<Lex>());
                    lexemesRows[k].AddRange(lexes);
                    lexes.Clear();
                    k++;
                }
            }
        }
        public bool StartAnalys()
        {

            int lexCount = 0;
            foreach (List<Lex> lexR in lexemesRows)
            {
                lexCount += lexR.Count;
            }

            if (lexCount != lexemes.Count)
            {
                errorMessage = $"Ошибка считывания.";
                return false;
            }

            for (int i = 0; i < lexemesRows.Count; i++)
            {
                string currentChain = "";
                for (int j = 0; j < lexemesRows[i].Count; j++)
                {
                    bool lastChar = false;
                    List<Lex> lexRow = new List<Lex>(j);
                    Lex lex = lexemesRows[i][j];
                    if (j >= lexemesRows[i].Count)
                    {
                        errorMessage = $"Ошибка";
                        return false;
                    }

                    Lex firstLex = lexemesRows[i][j];
                    Lex secondLex;

                    if (j >= lexemesRows[i].Count-1)
                    {
                        
                        secondLex = new Lex(-1,-1,"");
                        lastChar = true;
                    }
                    else
                    {
                        secondLex = lexemesRows[i][j + 1];
                    }

                    var rule = FindRule(firstLex, secondLex);
                    if (rule == PositionRules.Nothing && !lastChar) 
                    {
                        errorMessage = $"Ошибка лексемы {firstLex.val} ({secondLex.val})";
                        return false;
                    } 

                    if (firstLex.lexType == 1 || firstLex.lexType == 2)
                    {
                        Lex newLex = new Lex(firstLex.id, firstLex.lexType, firstLex.val);
                        firstLex.lexes.Add(newLex);
                        firstLex.val = "E";
 
                    }

                }

                List<Lex> totalLexes = ReplaceLexemesByRules(lexemesRows[i]);
                List<Lex> stackLexes = new List<Lex>();
                stackLexes.AddRange(totalLexes);

                for(int j = 0; j < stackLexes.Count; j++)
                {
                    if (totalLexes.Count == 0) continue;
                    if (stackLexes[j].lexes.Count > 0)
                    {
                        currentChain += stackLexes[j].val + " (";
                        foreach (Lex lex in stackLexes[j].lexes)
                        {
                            stackLexes.Add(lex);
                            currentChain += lex.val + "; ";
                        }
                        stackLexes.Remove(stackLexes[j]);
                        j--;
                        currentChain += ")";
                    }
                    currentChain += " -> ";
                    if (totalLexes.Count > 1)
                    {
                        errorMessage = $"Ошибка свертки.";
                        return false;
                    }
                }



                    currentChain += Environment.NewLine;
                chains.Add(currentChain);
                resultRows.Add(totalLexes);
            }
            return true;
        }
        private List<Lex>? ReplaceLexemesByRules(List<Lex> lexes)
        {
            List<Lex> result = new List<Lex>();
            result.AddRange(lexes);
            int startCount;
            List<Lex> startLexes = new List<Lex>();
            int trues = 0;
            do
            {
                startCount = result.Count;
                startLexes.AddRange(result);
                int ruleCounter = 0;
                foreach(List<Lex> rule in grammarList)
                {
                    ruleCounter++;
                    if (result.Count < rule.Count)
                    {
                        continue;
                    }
                    int offset = rule.Count;
                    trues = 0;
                    int curPos = 0;
                    bool firstLex;

                    int i = result.Count - offset;
                    while (true)
                    {
                        List<Lex> truesLexes = new List<Lex>();
                        firstLex = false;

                        for (int j = 0; j < rule.Count; j++)
                        {
                            if (rule == rule4 || rule == rule6)
                            {
                                if (result[i + j].val.Equals("E")) break;
                            }
                            if (result[i+j].val.Equals(rule[j].val)) 
                            {
                                trues++;
                                truesLexes.Add(result[i+j]);
                                if (!firstLex)
                                {
                                    firstLex = true;
                                    curPos = i;
                                }
                                
                            }
                            else
                                break;
                        }
                        if (trues == rule.Count)
                        {
                            foreach (Lex lex in truesLexes)
                            {
                                result.Remove(lex);
                            }
                            result.Insert(curPos, new Lex(-1, 1, "E", truesLexes));

                            //правила
                            List<string> rules = new List<string>();
                            foreach (Lex lex in result)
                            {
                                rules.Add(lex.val);
                            }
                            rules.Add("|");
                            //switch (ruleCounter)
                            //{
                            //    case 0: rules.Add($"Правило {ruleCounter+1}"); break;
                            //    case 1: rules.Add($"Правило {ruleCounter + 1}"); break;
                            //    case 2: rules.Add($"Правило {ruleCounter + 1}"); break;
                            //    case 3: rules.Add($"Правило {ruleCounter + 1}"); break;
                            //    case 4: rules.Add($"Правило {ruleCounter + 1}"); break;
                            //    case 5: rules.Add($"Правило {ruleCounter + 1}"); break;
                            //    case 6: rules.Add($"Правило {ruleCounter + 1}"); break;
                            //    case 7: rules.Add($"Правило {ruleCounter + 1}"); break;
                            //    case 8: rules.Add($"Правило {ruleCounter + 1}"); break;
                            //}
                            rules.Add($"Правило {ruleCounter}");
                            rules.Add("->");
                            resultRules.Add(rules);

                        }
                        trues = 0;
                        curPos = 0;
                        if (offset < result.Count)
                        {
                            offset++;
                            i = result.Count - offset;
                        }
                        else break;
                    }
                }
                ruleCounter = 0;
                trues = 0;
                if (result.Count == startCount)
                {
                    int k = 0;
                    foreach (Lex lex1 in result)
                    {
                        if (lex1.val.Equals(startLexes[k].val))
                        {
                            trues++;
                        }
                        k++;
                    }

                }
                startLexes.Clear();


            } while (trues != startCount);
            return result;
        }
        private PositionRules FindRule(Lex firstLex, Lex secondLex)
        {

            int fL_Type;
            int sL_Type;
            int ruleType;

            switch (firstLex.val)
            {
                case ";": fL_Type = 1; break;
                case "or": fL_Type = 2; break;
                case "xor": fL_Type = 3; break;
                case "and": fL_Type = 4; break;
                case "not": fL_Type = 5; break;
                case "(": fL_Type = 6; break;
                case ")": fL_Type = 7; break;
                case " ": fL_Type = 8; break;
                case ":=": fL_Type = 9; break;
                default: fL_Type = 0; break;
            }

            switch (secondLex.val)
            {
                case ";": sL_Type = 1; break;
                case "or": sL_Type = 2; break;
                case "xor": sL_Type = 3; break;
                case "and": sL_Type = 4; break;
                case "not": sL_Type = 5; break;
                case "(": sL_Type = 6; break;
                case ")": sL_Type = 7; break;
                case " ": sL_Type = 8; break;
                case ":=": sL_Type = 9; break;
                default: sL_Type = 0; break;
            }

            ruleType = ruleTable[fL_Type, sL_Type];

            switch (ruleType)
            {
                case 0: return PositionRules.Nothing;
                case 1: return PositionRules.Left;
                case 2: return PositionRules.Right;
                case 3: return PositionRules.Equivalent;
                    default: return PositionRules.Nothing;
            }
        }
    }
}