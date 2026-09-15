/**
 * Extra AI Practice Seed - 3 More Topics
 * Adds Knowledge Representation, AI Tools & Frameworks, Robotics & Applications
 * 3 Topics x 5 Subtopics x 10 Questions = 150 Questions
 */
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const PracticePath = require('../models/PracticePath');
const PracticeTopic = require('../models/PracticeTopic');
const PracticeSubtopic = require('../models/PracticeSubtopic');
const PracticeQuestion = require('../models/PracticeQuestion');

const DB_URL = process.env.DB_NAME || 'mongodb://localhost:27017/krutanic';

const o = (text, c) => ({ text, isCorrect: c });
const q = (title, slug, diff, stmt, opts, expl) => ({ title, slug, difficulty: diff, statement: stmt, options: opts, explanation: expl });

const EXTRA_TOPICS = [
  {
    title: 'Knowledge Representation', slug: 'knowledge-representation',
    description: 'Logic, ontologies, expert systems, knowledge graphs, and probabilistic reasoning.',
    subtopics: [
      {
        title: 'Propositional Logic', slug: 'propositional-logic', questions: [
          q('Proposition Def', 'proposition-def', 'Easy', 'A proposition is:', [o('Any type of question', false), o('A statement that is either true or false', true), o('A variable with no assigned value', false), o('A function with multiple outputs', false)], 'A proposition is a declarative statement with a definite truth value (T or F).'),
          q('AND Connective', 'and-connective', 'Easy', 'P AND Q is true when:', [o('Either P or Q is true', false), o('Both P and Q are true', true), o('P is false and Q is true', false), o('At least one operand is false', false)], 'Conjunction (AND) is true only when both operands are true.'),
          q('OR Connective', 'or-connective', 'Easy', 'P OR Q is false only when:', [o('Both P and Q are true', false), o('Both P and Q are false', true), o('P is true and Q is false', false), o('Q is true', false)], 'Disjunction (OR) is false only when both operands are false.'),
          q('Implication Truth', 'implication-def', 'Medium', 'P implies Q (P → Q) is false only when:', [o('P is false and Q is true', false), o('P is true and Q is false', true), o('Both P and Q are true', false), o('Both P and Q are false', false)], 'Material implication: false only when premise is true but conclusion is false.'),
          q('Modus Ponens', 'modus-ponens', 'Medium', 'Modus Ponens: if P→Q and P is true, we can conclude:', [o('P is false', false), o('Q is true', true), o('Q is false', false), o('P→Q is false', false)], 'Modus Ponens: {P→Q, P} ⊢ Q — fundamental inference rule.'),
          q('Tautology', 'tautology-def', 'Medium', 'A tautology is a statement that is:', [o('Always false', false), o('Always true regardless of variable assignments', true), o('True only sometimes', false), o('Undefined in classical logic', false)], 'A tautology is true under all possible truth-value assignments.'),
          q('Contradiction', 'contradiction-def', 'Easy', 'P AND NOT P is always:', [o('True', false), o('False — a contradiction', true), o('Undefined', false), o('Conditionally true', false)], 'A statement cannot be both true and its own negation at the same time.'),
          q('De Morgans Law', 'de-morgans', 'Medium', "De Morgan's Law: NOT(P AND Q) equals:", [o('NOT P AND NOT Q', false), o('NOT P OR NOT Q', true), o('P OR Q', false), o('NOT P implies NOT Q', false)], "De Morgan's: NOT(P∧Q) = (¬P ∨ ¬Q)."),
          q('SAT Problem', 'sat-problem', 'Hard', 'The Boolean Satisfiability (SAT) problem asks:', [o('If a formula is always true (tautology)', false), o('If there exists an assignment making the formula satisfiable', true), o('The shortest proof of a theorem', false), o('The number of true variable assignments', false)], 'SAT: does there exist a truth assignment satisfying a propositional formula? First NP-complete problem.'),
          q('Resolution Proof', 'resolution-logic', 'Hard', 'Resolution is a proof technique that:', [o('Uses gradient descent to find proofs', false), o('Derives new clauses from existing ones to prove satisfiability', true), o('Assigns truth values to all variables', false), o('Converts formulas to decision trees', false)], 'Resolution combines clauses sharing complementary literals to derive new clauses.'),
        ]
      },
      {
        title: 'First-Order Logic', slug: 'first-order-logic', questions: [
          q('FOL Extension', 'fol-def', 'Easy', 'First-Order Logic (FOL) extends propositional logic by adding:', [o('Only AND and OR operators', false), o('Quantifiers, predicates, functions, and constants', true), o('Probability values to statements', false), o('Neural network computation layers', false)], 'FOL adds universal/existential quantification enabling "All humans are mortal".'),
          q('Universal Quantifier', 'universal-quantifier', 'Easy', '∀x P(x) means:', [o('There exists an x such that P(x) is true', false), o('For all x in the domain, P(x) is true', true), o('P(x) is sometimes true', false), o('P(x) is never true', false)], 'Universal quantifier ∀: the predicate holds for every element in the domain.'),
          q('Existential Quantifier', 'existential-quantifier', 'Easy', '∃x P(x) means:', [o('P(x) is true for all x', false), o('At least one x exists for which P(x) is true', true), o('P(x) is false for all x', false), o('x does not exist in the domain', false)], 'Existential quantifier ∃: at least one domain element satisfies the predicate.'),
          q('FOL Predicate', 'predicate-fol', 'Easy', 'In FOL, a predicate represents:', [o('A constant value in the domain', false), o('A relationship or property that may be true or false of objects', true), o('A function returning a number', false), o('A quantified variable', false)], 'Predicates represent n-ary relations over domain objects, e.g., Loves(x, y).'),
          q('Unification', 'unification-fol', 'Hard', 'Unification in FOL finds:', [o('The domain of a quantifier', false), o('A substitution making two expressions syntactically identical', true), o('The truth value of a formula', false), o('The most general quantifier', false)], 'Unification finds the Most General Unifier (MGU) making two terms equal.'),
          q('Skolemization', 'skolemization', 'Hard', 'Skolemization removes existential quantifiers by:', [o('Removing universal quantifiers instead', false), o('Replacing them with Skolem constants or functions', true), o('Deleting all predicates', false), o('Converting to propositional form', false)], 'Skolemization eliminates ∃ quantifiers for prenex normal form conversion.'),
          q('Horn Clauses', 'horn-clauses', 'Hard', 'Prolog logic programming is based on:', [o('Propositional logic only', false), o('First-Order Logic with Horn clauses', true), o('Fuzzy logic', false), o('Probabilistic logic programming', false)], 'Prolog uses FOL Horn clauses enabling efficient backward chaining resolution.'),
          q('Open World Assumption', 'owa-fol', 'Medium', 'The Open World Assumption (OWA) states:', [o('All unknown facts are assumed false', false), o('Unknown facts may be true or false — we simply do not know', true), o('All domain facts are completely known', false), o('Only explicitly quantified facts exist', false)], 'OWA (used in ontologies/KGs) treats unknown info as neither true nor false.'),
          q('FOL Completeness', 'completeness-fol', 'Hard', "Gödel's Completeness Theorem states:", [o('FOL is inconsistent', false), o('Every logically valid FOL formula has a formal proof from axioms', true), o('FOL cannot express arithmetic', false), o('FOL is undecidable', false)], "Gödel's Completeness: if ⊨φ then ⊢φ — validity implies provability in FOL."),
          q('FOL vs Prop Logic', 'fol-vs-prop', 'Medium', 'FOL is more expressive than propositional logic because:', [o('It handles only numbers', false), o('It can express statements about objects and their relationships', true), o('It is faster to evaluate', false), o('It uses truth tables', false)], 'FOL quantifies over objects and relations; propositional logic only handles truth values.'),
        ]
      },
      {
        title: 'Knowledge Graphs', slug: 'knowledge-graphs', questions: [
          q('Knowledge Graph Def', 'knowledge-graph-def', 'Easy', 'A knowledge graph represents information as:', [o('A flat relational table', false), o('Nodes (entities) connected by typed edges (relationships)', true), o('A sequence of text tokens', false), o('A decision tree structure', false)], 'KGs store facts as (subject, predicate, object) triples — entity-relationship graph.'),
          q('RDF Triples', 'rdf-def', 'Medium', 'RDF represents data as:', [o('JSON array structures', false), o('Subject-Predicate-Object triples', true), o('Relational database tables', false), o('XML-only documents', false)], 'RDF models facts as triples — the foundation of the Semantic Web.'),
          q('OWL Ontology', 'owl-def', 'Medium', 'OWL (Web Ontology Language) is used to:', [o('Style web pages', false), o('Define rich ontologies with description logic semantics', true), o('Query databases with SQL-like syntax', false), o('Build neural network graphs', false)], 'OWL defines complex class hierarchies and relationships with formal logic semantics.'),
          q('SPARQL Query', 'sparql-def', 'Medium', 'SPARQL is used to:', [o('Train machine learning models', false), o('Query and update RDF knowledge graphs', true), o('Style semantic ontologies', false), o('Compress knowledge bases', false)], 'SPARQL is the standard query language for RDF triple stores.'),
          q('Google KG', 'google-kg', 'Easy', "Google's Knowledge Graph powers:", [o('Google Maps routing only', false), o('Rich entity information panels in search results', true), o('Gmail spam filtering', false), o('Google Translate translation', false)], 'Google KG shows structured entity facts in the right-side knowledge panels.'),
          q('Link Prediction KG', 'link-prediction-kg', 'Hard', 'Link prediction in knowledge graphs aims to:', [o('Find cycles in the graph', false), o('Predict missing relationships between entities', true), o('Compress the graph for storage', false), o('Cluster similar entities together', false)], 'Link prediction completes KGs by inferring missing (subject, relation, object) triples.'),
          q('TransE Embedding', 'entity-embedding-kg', 'Hard', 'TransE embeds knowledge graph entities and relations by:', [o('One-hot encoding all entities', false), o('Modeling relations as translations: head + relation ≈ tail', true), o('Clustering entity types together', false), o('Using transformer self-attention', false)], 'TransE: h + r ≈ t for valid triples — embeds KG in vector space.'),
          q('Wikidata', 'wikidata-def', 'Easy', 'Wikidata is:', [o('A specific Wikipedia article', false), o('A free collaborative structured knowledge base', true), o('A web search engine', false), o('A large language model', false)], 'Wikidata is a structured, machine-readable knowledge base maintained by Wikimedia Foundation.'),
          q('Ontology AI', 'ontology-ai', 'Medium', 'An ontology in AI formally represents:', [o('A training dataset for ML', false), o('Concepts, relationships, and domain knowledge in formal language', true), o('A type of neural network', false), o('Learned model weights', false)], 'Ontologies define vocabulary and relationships for machine-readable knowledge.'),
          q('Triple Store', 'triple-store', 'Medium', 'A triple store is a database designed to store:', [o('Tabular relational data', false), o('RDF triples for SPARQL querying', true), o('Dense vector embeddings', false), o('Image pixel data', false)], 'Triple stores are purpose-built for RDF data with SPARQL query support.'),
        ]
      },
      {
        title: 'Expert Systems', slug: 'expert-systems', questions: [
          q('Expert System Def', 'expert-sys-def', 'Easy', 'An Expert System:', [o('Learns patterns from training data', false), o('Uses encoded human expert knowledge to solve domain-specific problems', true), o('Plays strategic games', false), o('Generates synthetic images', false)], 'Expert systems encode domain expert knowledge as IF-THEN rules.'),
          q('Knowledge Base ES', 'knowledge-base-es', 'Easy', 'The knowledge base of an expert system contains:', [o('Raw statistical training data', false), o('Domain-specific facts and IF-THEN rules', true), o('Neural network weights', false), o('User interface code', false)], 'The KB stores all domain-specific facts and rules encoded by experts.'),
          q('Inference Engine', 'inference-engine', 'Medium', 'The inference engine of an expert system:', [o('Stores domain facts and rules', false), o('Applies rules to known facts to derive new conclusions', true), o('Learns from new data examples', false), o('Displays results to users', false)], 'The inference engine applies forward or backward chaining to derive conclusions.'),
          q('Forward Chaining', 'forward-chaining-es', 'Medium', 'Forward chaining reasoning is:', [o('Goal-driven — starting from a goal', false), o('Data-driven — reasoning from known facts to conclusions', true), o('Searching backward from goals to facts', false), o('Random rule application order', false)], 'Forward chaining starts with facts and fires rules until reaching the goal.'),
          q('Backward Chaining', 'backward-chaining-es', 'Medium', 'Backward chaining reasoning is:', [o('Data-driven starting from known facts', false), o('Goal-driven — starting from goal and finding supporting evidence', true), o('Random backward selection', false), o('Used only in neural networks', false)], 'Backward chaining starts with the goal hypothesis and searches for evidence.'),
          q('MYCIN System', 'mycin-def', 'Medium', 'MYCIN was an expert system used for:', [o('Playing chess against grandmasters', false), o('Diagnosing bacterial infections and recommending antibiotics', true), o('Financial portfolio forecasting', false), o('Natural language translation', false)], 'MYCIN (Stanford 1970s) diagnosed bacterial infections using ~600 production rules.'),
          q('ES Uncertainty', 'uncertainty-es', 'Medium', 'Expert systems handle uncertainty using:', [o('Random guessing mechanisms', false), o('Certainty factors or Bayesian probability', true), o('Deep learning models', false), o('Ignoring all uncertain rules', false)], 'MYCIN used certainty factors; modern systems use Bayesian or fuzzy logic.'),
          q('ES Limitations', 'limitations-es', 'Medium', 'A key limitation of traditional expert systems is:', [o('They run too fast for practical use', false), o('They cannot learn from new data — knowledge acquisition bottleneck', true), o('They require GPU hardware', false), o('They use too much memory', false)], 'Expert systems require laborious manual knowledge engineering and cannot self-update.'),
          q('Rule vs ML', 'rule-vs-ml', 'Easy', 'The fundamental difference between expert systems and ML is:', [o('Expert systems use more training data', false), o('Expert systems use explicit handcrafted rules; ML learns rules from data', true), o('ML is always slower to execute', false), o('They are fundamentally identical technologies', false)], 'Expert systems: handcrafted rules. ML: inductively learned from data examples.'),
          q('Knowledge Engineer', 'knowledge-engineer', 'Easy', 'A knowledge engineer:', [o('Writes ML model training code', false), o('Elicits and encodes expert knowledge into the knowledge base', true), o('Designs neural network architectures', false), o('Collects and labels training datasets', false)], 'Knowledge engineers translate human expert knowledge into formal rules.'),
        ]
      },
      {
        title: 'Probabilistic Reasoning', slug: 'probabilistic-reasoning', questions: [
          q('Bayes Theorem', 'bayes-theorem', 'Medium', "Bayes' Theorem calculates P(A|B) using:", [o('P(A) and P(B|A) alone', false), o('P(B|A), P(A), and P(B)', true), o('P(A AND B) only', false), o('P(A OR B)', false)], "Bayes': P(A|B) = P(B|A) * P(A) / P(B)."),
          q('Bayesian Network', 'bayesian-network', 'Hard', 'A Bayesian Network is a:', [o('Neural network with dropout regularization', false), o('Directed acyclic graph representing probabilistic dependencies', true), o('Graph neural network for classification', false), o('Recurrent neural network variant', false)], 'Bayesian Networks encode joint probability via conditional independence (DAG).'),
          q('Prior vs Posterior', 'prior-posterior', 'Medium', 'The prior probability P(H) is updated to posterior using:', [o('The evidence alone without any model', false), o('The likelihood P(D|H) via Bayes theorem', true), o('The loss function', false), o('Backpropagation', false)], "Likelihood P(D|H) updates prior to posterior via Bayes' theorem."),
          q('HMM Definition', 'hmm-def', 'Hard', 'Hidden Markov Models are used for:', [o('Static image classification tasks', false), o('Sequential data with hidden latent states', true), o('Unsupervised clustering tasks', false), o('Dimensionality reduction', false)], 'HMMs model sequences where underlying states are unobserved (hidden).'),
          q('Naive Bayes Assumption', 'naive-bayes-assump', 'Medium', "Naive Bayes' 'naive' assumption is:", [o('All classes are equiprobable', false), o('Features are conditionally independent given the class label', true), o('Data follows a normal distribution', false), o('There is only one feature variable', false)], 'Naive Bayes: P(x1...xn|y) = ∏ P(xi|y) — features independent given class.'),
          q('Markov Property', 'markov-assumption', 'Medium', 'The Markov property states:', [o('All past states are equally important', false), o('The future depends only on the current state, not the full history', true), o('States are always hidden from observation', false), o('Transition probabilities are uniform', false)], 'Markov property: future ⊥ history | current state.'),
          q('Kalman Filter', 'kalman-filter', 'Hard', 'Kalman Filters are used for:', [o('Image classification tasks', false), o('Optimal state estimation in linear Gaussian dynamic systems', true), o('Training deep neural networks', false), o('Text sequence generation', false)], 'Kalman filters optimally combine noisy measurements with system model predictions.'),
          q('Monte Carlo Methods', 'monte-carlo', 'Medium', 'Monte Carlo methods estimate quantities by:', [o('Gradient-based mathematical optimization', false), o('Random sampling and statistical averaging', true), o('Exact analytical derivation', false), o('Decision tree splitting criteria', false)], 'Monte Carlo uses large numbers of random samples to approximate integrals.'),
          q('Conditional Independence', 'cond-independence', 'Hard', 'X and Y are conditionally independent given Z if:', [o('P(X,Y) = P(X)P(Y)', false), o('P(X|Y,Z) = P(X|Z)', true), o('P(X|Z) = P(Y|Z)', false), o('P(Z|X,Y) = 1', false)], 'Conditional independence: knowing Z makes Y irrelevant for predicting X.'),
          q('EM Algorithm', 'em-algorithm', 'Hard', 'The Expectation-Maximization (EM) algorithm is used for:', [o('Supervised classification with full labels', false), o('Maximum likelihood estimation with latent/hidden variables', true), o('Direct reinforcement learning', false), o('Generative image synthesis', false)], 'EM: E-step computes expected log-likelihood; M-step maximizes parameters.'),
        ]
      },
    ]
  },
  {
    title: 'AI Tools & Frameworks', slug: 'ai-tools-frameworks',
    description: 'Python ecosystem, TensorFlow, PyTorch, MLOps tools, and AI development platforms.',
    subtopics: [
      {
        title: 'Python AI Ecosystem', slug: 'python-ai', questions: [
          q('NumPy Role', 'numpy-def', 'Easy', 'NumPy is used in AI primarily for:', [o('Building and training neural networks', false), o('Efficient numerical multi-dimensional array operations', true), o('Interactive data visualization', false), o('Web scraping and data collection', false)], 'NumPy provides fast, vectorized N-dimensional array computations for AI.'),
          q('Pandas Role', 'pandas-def', 'Easy', 'Pandas is used in AI for:', [o('Training deep neural networks', false), o('Data manipulation, cleaning, and analysis using DataFrames', true), o('Model visualization', false), o('Model deployment to cloud', false)], 'Pandas DataFrames make data loading, cleaning, and exploration easy.'),
          q('Matplotlib Role', 'matplotlib-def', 'Easy', 'Matplotlib is used for:', [o('Training machine learning models', false), o('Plotting data and visualizing results', true), o('Data preprocessing pipelines', false), o('Model deployment', false)], 'Matplotlib is Python\'s standard library for creating data visualizations.'),
          q('Scikit-learn Role', 'sklearn-def', 'Easy', 'Scikit-learn provides:', [o('Only deep learning tools', false), o('Classical ML algorithms, preprocessing tools, and evaluation metrics', true), o('Only neural network layers', false), o('Database connectivity', false)], 'Scikit-learn is the go-to Python library for classical machine learning.'),
          q('Jupyter Notebooks', 'jupyter-def', 'Easy', 'Jupyter Notebooks are popular in AI because:', [o('They completely replace professional IDEs', false), o('They enable interactive code execution with inline results and visualizations', true), o('They compile code faster than other tools', false), o('They are required by TensorFlow', false)], 'Jupyter combines code, output, explanations, and plots in one interactive document.'),
          q('Not AI Library', 'py-ai-libs', 'Easy', 'Which is NOT an AI/ML Python library?', [o('TensorFlow', false), o('PyTorch', false), o('Django', true), o('Keras', false)], 'Django is a web framework — not an AI/ML library.'),
          q('SciPy Role', 'scipy-def', 'Medium', 'SciPy extends NumPy by providing:', [o('Neural network layer implementations', false), o('Scientific computing: optimization, integration, and statistics', true), o('Data loading utilities', false), o('GPU acceleration via CUDA', false)], 'SciPy adds optimization, FFT, signal processing, and statistical testing.'),
          q('Virtual Environments', 'venv-ai', 'Easy', 'Virtual environments in Python AI projects are used to:', [o('Speed up GPU training', false), o('Isolate project-specific package dependencies', true), o('Deploy models to the cloud', false), o('Visualize neural network architectures', false)], 'Virtual environments prevent dependency conflicts between different AI projects.'),
          q('CuPy GPU', 'gpu-python', 'Medium', 'CuPy is a Python library providing:', [o('CPU-accelerated NumPy replacement', false), o('GPU-accelerated NumPy-compatible arrays using CUDA', true), o('Interactive visualization tools', false), o('Automated machine learning', false)], 'CuPy mirrors NumPy\'s API but executes on GPU via CUDA.'),
          q('AutoML', 'automl-def', 'Medium', 'AutoML tools automate:', [o('Raw training data collection', false), o('Model selection, hyperparameter tuning, and pipeline optimization', true), o('Only model deployment', false), o('Writing Python code from scratch', false)], 'AutoML automates algorithm selection, preprocessing, and hyperparameter tuning.'),
        ]
      },
      {
        title: 'TensorFlow & Keras', slug: 'tensorflow-keras', questions: [
          q('TF Creator', 'tf-creator', 'Easy', 'TensorFlow was developed by:', [o('Facebook AI Research (FAIR)', false), o('Google Brain', true), o('OpenAI', false), o('Microsoft Research', false)], 'TensorFlow was created by Google Brain and open-sourced in November 2015.'),
          q('Keras API', 'keras-api', 'Easy', 'Keras is best described as:', [o('A standalone ML framework', false), o('A high-level neural network API built on TensorFlow/JAX', true), o('A data preprocessing library', false), o('A cloud deployment platform', false)], 'Keras provides a user-friendly high-level API for building neural networks.'),
          q('TF Tensor', 'tf-tensor', 'Easy', 'In TensorFlow, a Tensor is:', [o('A standard Python list', false), o('A multi-dimensional array optimized for GPU computation', true), o('A specific model layer type', false), o('A loss function', false)], 'TF tensors are immutable GPU-compatible arrays with automatic differentiation.'),
          q('GradientTape', 'tf-gradienttape', 'Hard', 'tf.GradientTape records operations for:', [o('Efficient data loading', false), o('Automatic differentiation to compute gradients', true), o('Model serialization to disk', false), o('Data visualization', false)], 'GradientTape records the forward pass computation to compute gradients via backprop.'),
          q('Sequential Model', 'keras-sequential', 'Easy', 'Keras Sequential model is used for:', [o('Multi-input or multi-output models', false), o('Simple linear stacks of layers without branching', true), o('Distributed multi-GPU training', false), o('Reinforcement learning only', false)], 'Sequential stacks layers linearly — input flows through each layer in order.'),
          q('model.compile()', 'model-compile', 'Medium', 'Calling model.compile() in Keras configures:', [o('The data loading pipeline', false), o('Optimizer, loss function, and evaluation metrics', true), o('The number of training epochs', false), o('GPU memory allocation', false)], 'compile() specifies the optimizer, loss, and metrics before model.fit().'),
          q('tf.data.Dataset', 'tf-datasets', 'Medium', 'tf.data.Dataset provides:', [o('Pre-trained model weights', false), o('Efficient, scalable input pipelines for data loading and preprocessing', true), o('Model evaluation tools', false), o('GPU memory management', false)], 'tf.data builds high-performance pipelines with batching, shuffling, and prefetching.'),
          q('TF SavedModel', 'saved-model-tf', 'Medium', 'TensorFlow SavedModel format stores:', [o('Only the model weight values', false), o('Complete model: architecture, weights, and computation graph', true), o('Only the model architecture', false), o('Only training hyperparameters', false)], 'SavedModel is the universal TF serialization format for deployment.'),
          q('TensorFlow Lite', 'tflite-def', 'Medium', 'TensorFlow Lite is designed for:', [o('Large-scale cloud training', false), o('Deploying ML models on mobile and edge devices', true), o('Research prototyping and experimentation', false), o('Data collection and labeling', false)], 'TFLite optimizes and converts models for mobile, embedded, and IoT deployment.'),
          q('Keras Callbacks', 'callbacks-keras', 'Medium', 'Keras callbacks allow you to:', [o('Define the model layer architecture', false), o('Execute custom actions during training (checkpointing, early stopping)', true), o('Load and preprocess training data', false), o('Compile and configure the model', false)], 'Callbacks hook into training events for logging, saving, and scheduling.'),
        ]
      },
      {
        title: 'PyTorch', slug: 'pytorch', questions: [
          q('PyTorch Creator', 'pytorch-creator', 'Easy', 'PyTorch was developed by:', [o('Google Brain', false), o('Meta (Facebook) AI Research', true), o('Microsoft Research', false), o('Amazon AWS', false)], 'PyTorch was developed by Meta FAIR and open-sourced in January 2017.'),
          q('Dynamic Computation Graph', 'dynamic-graph', 'Medium', 'PyTorch uses dynamic computation graphs, meaning:', [o('The graph is fixed before training begins', false), o('The graph is built on-the-fly during each forward pass', true), o('The graph structure never changes', false), o('The graph is shared across all models', false)], 'PyTorch\'s eager execution builds computation graphs dynamically per run.'),
          q('Autograd', 'autograd-pytorch', 'Medium', 'PyTorch autograd automatically computes:', [o('The optimal model architecture', false), o('Gradients for tensors with requires_grad=True', true), o('Batch normalization statistics', false), o('Data augmentation transformations', false)], 'Autograd computes gradients via reverse-mode automatic differentiation.'),
          q('nn.Module', 'nn-module', 'Medium', 'PyTorch nn.Module is the base class for:', [o('Data loader utilities', false), o('All neural network models and layer definitions', true), o('Optimizers and schedulers', false), o('Loss function implementations', false)], 'nn.Module provides parameter management for all neural network components.'),
          q('DataLoader', 'dataloader-pt', 'Easy', 'PyTorch DataLoader:', [o('Defines the neural network architecture', false), o('Batches, shuffles, and loads data efficiently with multiple workers', true), o('Computes the training loss', false), o('Saves trained model checkpoints', false)], 'DataLoader wraps a Dataset providing mini-batches with optional shuffling.'),
          q('optimizer.step()', 'optimizer-step', 'Easy', 'optimizer.step() in PyTorch:', [o('Computes the backward pass gradients', false), o('Updates all model parameters using computed gradients', true), o('Clears accumulated gradients to zero', false), o('Saves the current model state', false)], 'optimizer.step() applies gradient-based parameter updates.'),
          q('zero_grad() Purpose', 'zero-grad', 'Easy', 'optimizer.zero_grad() must be called before backward() because:', [o('Gradients reset to zero automatically each step', false), o('PyTorch accumulates gradients by default — zero_grad() clears them', true), o('It improves training speed significantly', false), o('CUDA requires it before computation', false)], 'PyTorch accumulates gradients — zero_grad() must explicitly clear them.'),
          q('CUDA PyTorch', 'cuda-pytorch', 'Medium', 'To move a tensor to GPU in PyTorch:', [o('tensor.gpu()', false), o('tensor.cuda() or tensor.to("cuda")', true), o('tensor.to_gpu(True)', false), o('torch.gpu(tensor)', false)], 'tensor.cuda() or tensor.to("cuda") moves a tensor to the GPU device.'),
          q('PyTorch Lightning', 'pytorch-lightning', 'Medium', 'PyTorch Lightning is:', [o('A faster alternative implementation of PyTorch', false), o('A high-level framework reducing PyTorch training boilerplate', true), o('A visualization and debugging tool', false), o('A model deployment platform', false)], 'Lightning organizes PyTorch code for reproducibility and less boilerplate.'),
          q('ONNX Export', 'onnx-export', 'Hard', 'ONNX (Open Neural Network Exchange) allows:', [o('Training models faster on fewer resources', false), o('Exporting models between different ML frameworks', true), o('Automatic architecture search', false), o('Mobile quantization for inference', false)], 'ONNX is an interoperability format enabling cross-framework model portability.'),
        ]
      },
      {
        title: 'Cloud AI Platforms', slug: 'cloud-ai', questions: [
          q('Google AI Platform', 'gcp-ai', 'Medium', 'Google Cloud AI Platform provides:', [o('Only image storage services', false), o('Managed ML training, serving, and AutoML capabilities', true), o('Only database services', false), o('Only networking tools', false)], 'GCP Vertex AI offers end-to-end managed ML platform services.'),
          q('AWS SageMaker', 'aws-sagemaker', 'Medium', 'AWS SageMaker is:', [o('A document storage service', false), o('A fully managed ML platform for building, training, and deploying models', true), o('A virtual machine service', false), o('A messaging service', false)], 'SageMaker provides tools for the full ML lifecycle on AWS.'),
          q('Azure ML', 'azure-ml', 'Medium', 'Microsoft Azure Machine Learning is:', [o('A graph database service', false), o('A cloud platform for ML model development and deployment', true), o('A storage blob service', false), o('A CDN service', false)], 'Azure ML provides cloud-based ML development, experimentation, and deployment.'),
          q('GPU Instance Types', 'gpu-instances', 'Medium', 'Cloud GPU instances for AI training are preferred because:', [o('They are always cheaper than CPUs', false), o('GPUs have thousands of cores for parallel tensor operations', true), o('They use less energy', false), o('They have more memory than CPUs', false)], 'GPUs massively parallelize the matrix operations required for neural network training.'),
          q('Colab', 'colab-def', 'Easy', 'Google Colab is:', [o('A cloud database service', false), o('A free cloud-based Jupyter notebook environment with GPU access', true), o('A model deployment platform', false), o('A dataset storage service', false)], 'Colab provides free GPU/TPU-accelerated Jupyter notebooks in the browser.'),
          q('TPU', 'tpu-def', 'Hard', 'TPUs (Tensor Processing Units) are:', [o('General-purpose CPUs optimized for AI', false), o('Google-designed ASICs accelerating matrix operations in ML', true), o('A type of GPU made by Google', false), o('Memory chips for AI training', false)], 'TPUs are custom ASICs designed by Google specifically for tensor computation.'),
          q('Weights and Biases', 'wandb-def', 'Medium', 'Weights & Biases (W&B) is used for:', [o('Setting model weights and biases manually', false), o('Experiment tracking, visualization, and model management', true), o('Data collection and labeling', false), o('Cloud GPU provisioning', false)], 'W&B tracks experiments, hyperparameters, metrics, and artifacts.'),
          q('HuggingFace Hub', 'hf-hub', 'Easy', 'HuggingFace Hub provides:', [o('Cloud computing resources', false), o('A repository of pretrained models and datasets for AI', true), o('Database services', false), o('GPU rental services', false)], 'HuggingFace Hub hosts thousands of open-source pretrained models and datasets.'),
          q('Ray Framework', 'ray-framework', 'Hard', 'The Ray framework is used for:', [o('Rendering 3D graphics', false), o('Distributed computing for AI workloads like training and hyperparameter search', true), o('Web application development', false), o('Database query optimization', false)], 'Ray enables distributed training, hyperparameter search, and reinforcement learning.'),
          q('MLflow', 'mlflow-def', 'Medium', 'MLflow is an open-source platform for:', [o('Only model deployment', false), o('ML experiment tracking, model registry, and deployment', true), o('Only data preprocessing', false), o('Only neural architecture search', false)], 'MLflow manages the full ML lifecycle: tracking, projects, models, and registry.'),
        ]
      },
      {
        title: 'Data Engineering for AI', slug: 'data-engineering-ai', questions: [
          q('Data Pipeline', 'data-pipeline', 'Easy', 'A data pipeline in AI refers to:', [o('A physical pipe for data storage', false), o('An automated workflow processing raw data into ML-ready format', true), o('A model training script only', false), o('A deployment configuration file', false)], 'Data pipelines automate ingestion, cleaning, transformation, and feature extraction.'),
          q('ETL Process', 'etl-process', 'Medium', 'ETL stands for:', [o('Evaluate, Train, Launch', false), o('Extract, Transform, Load', true), o('Embed, Test, Link', false), o('Execute, Tune, Learn', false)], 'ETL: Extract data from sources, Transform it, Load into target system.'),
          q('Data Versioning', 'data-versioning', 'Medium', 'Data version control (DVC) in ML is used to:', [o('Control GPU compute versions', false), o('Track and version large datasets and model files', true), o('Version Python packages', false), o('Manage cloud server versions', false)], 'DVC tracks large data files and ML models alongside Git code.'),
          q('Feature Engineering', 'feature-engineering', 'Medium', 'Feature engineering refers to:', [o('Building neural network features (layers)', false), o('Creating informative input variables from raw data to improve ML models', true), o('Selecting the best hardware features', false), o('Writing feature request documentation', false)], 'Feature engineering transforms raw data into informative model inputs.'),
          q('Data Imbalance', 'data-imbalance', 'Medium', 'Oversampling techniques like SMOTE address:', [o('Models that have too many parameters', false), o('Imbalanced class distributions in classification datasets', true), o('Overfitting to training data', false), o('Missing feature values', false)], 'SMOTE creates synthetic minority class examples to balance class distributions.'),
          q('Data Labeling', 'data-labeling', 'Easy', 'Data labeling in AI refers to:', [o('Naming Python variables descriptively', false), o('Annotating raw data with correct ground truth labels for training', true), o('Adding version labels to models', false), o('Configuring cloud storage labels', false)], 'Data labeling creates supervised training datasets by annotating raw data.'),
          q('Missing Values', 'missing-values', 'Easy', 'Common strategies for handling missing data values include:', [o('Deleting the entire model', false), o('Imputation with mean/median or using models that handle NaN', true), o('Converting all data to text', false), o('Ignoring the ML task entirely', false)], 'Missing values can be imputed (mean, median, KNN) or flagged as a feature.'),
          q('Data Normalization', 'data-normalization', 'Easy', 'Normalization of input features is done to:', [o('Increase the training dataset size', false), o('Ensure all features have similar scale to improve training stability', true), o('Add more training examples', false), o('Reduce the number of model parameters', false)], 'Normalization prevents features with large values from dominating learning.'),
          q('Apache Spark AI', 'spark-ai', 'Hard', 'Apache Spark is used in AI for:', [o('Serving real-time predictions', false), o('Distributed large-scale data preprocessing and feature engineering', true), o('Neural network architecture search', false), o('GPU model training', false)], 'Spark distributes data processing across clusters for big data AI pipelines.'),
          q('Synthetic Data', 'synthetic-data', 'Medium', 'Synthetic data in AI is used to:', [o('Replace all real-world data', false), o('Augment training data when real labeled data is scarce or private', true), o('Speed up model inference', false), o('Compress existing datasets', false)], 'Synthetic data generated by simulations or GANs supplements scarce real data.'),
        ]
      },
    ]
  },
  {
    title: 'Robotics & AI Applications', slug: 'robotics-applications',
    description: 'AI in robotics, autonomous systems, planning, perception, and real-world deployments.',
    subtopics: [
      {
        title: 'Robotics Fundamentals', slug: 'robotics-fundamentals', questions: [
          q('Robot Definition', 'robot-def', 'Easy', 'A robot in AI is:', [o('Only a mechanical arm', false), o('A machine that can sense, reason, and act in the physical world', true), o('Only a software program', false), o('A type of neural network', false)], 'Robots combine perception, reasoning, and actuation to operate in the world.'),
          q('SLAM', 'slam-def', 'Medium', 'SLAM stands for:', [o('Sequential Learning and Mapping', false), o('Simultaneous Localization And Mapping', true), o('Sensor-based Location and Movement', false), o('Supervised Learning for Autonomous Machines', false)], 'SLAM enables robots to build a map of an unknown environment while tracking position.'),
          q('Robot Perception', 'robot-perception', 'Easy', 'Robot perception in AI refers to:', [o('The robot\'s physical body design', false), o('Processing sensor data to understand the environment', true), o('The robot\'s control algorithm only', false), o('The robot\'s database system', false)], 'Perception involves processing camera, LiDAR, and other sensor data to understand the world.'),
          q('Degrees of Freedom', 'dof-def', 'Medium', 'Degrees of freedom (DOF) in robotics refers to:', [o('The robot\'s computational freedom', false), o('The number of independent movements a robot can make', true), o('The robot\'s processing speed', false), o('The number of sensors attached', false)], 'DOF describes how many independent parameters define a robot\'s configuration.'),
          q('Inverse Kinematics', 'inverse-kinematics', 'Hard', 'Inverse kinematics in robotics solves:', [o('Finding joint positions given task space goals', true), o('Forward position computation from joint angles', false), o('Path planning between waypoints', false), o('Sensor calibration problems', false)], 'IK: given desired end-effector position, compute required joint angles.'),
          q('ROS', 'ros-def', 'Medium', 'ROS (Robot Operating System) is:', [o('A full operating system replacing Linux', false), o('A middleware framework for robot software development', true), o('A programming language for robots', false), o('A hardware specification standard', false)], 'ROS provides tools, libraries, and conventions for robot software development.'),
          q('Path Planning', 'path-planning', 'Medium', 'Path planning in robotics determines:', [o('The robot\'s training schedule', false), o('A collision-free path from start to goal in the environment', true), o('The mechanical joint specifications', false), o('The sensor placement', false)], 'Path planning finds feasible, often optimal, robot trajectories in configuration space.'),
          q('PID Controller', 'pid-controller', 'Medium', 'A PID controller in robotics combines:', [o('Position, Inertia, and Dynamics', false), o('Proportional, Integral, and Derivative error terms for control', true), o('Parallel, Independent, and Distributed processing', false), o('Planning, Inference, and Decision making', false)], 'PID controllers correct errors using proportional, integral, and derivative feedback.'),
          q('Manipulation', 'robot-manipulation', 'Medium', 'Robot manipulation in AI involves:', [o('Controlling robot locomotion', false), o('Using robot arms/hands to interact with and move objects', true), o('Robot communication protocols', false), o('Sensor fusion algorithms', false)], 'Manipulation covers grasping, pushing, and precise object handling tasks.'),
          q('Sim-to-Real', 'sim-to-real', 'Hard', 'The sim-to-real gap in robot learning refers to:', [o('The speed difference between simulators and real hardware', false), o('Performance degradation when policies trained in simulation are deployed on real robots', true), o('The cost difference between simulators and real robots', false), o('The time to program simulated vs real robots', false)], 'Sim-to-real gap: distribution shift between simulated training and real-world deployment.'),
        ]
      },
      {
        title: 'Autonomous Systems', slug: 'autonomous-systems', questions: [
          q('Levels of Autonomy', 'autonomy-levels', 'Medium', 'SAE levels of driving automation range from:', [o('1 to 5', false), o('0 (no automation) to 5 (full automation)', true), o('A to E', false), o('Beginner to Expert', false)], 'SAE defines L0-L5: L0=no automation, L5=full self-driving in all conditions.'),
          q('Sensor Fusion', 'sensor-fusion', 'Medium', 'Sensor fusion in autonomous vehicles combines:', [o('Data from one sensor only for accuracy', false), o('Data from multiple sensors for more robust perception', true), o('Only camera data from multiple cameras', false), o('Only LiDAR point clouds', false)], 'Sensor fusion combines camera, LiDAR, radar, and GPS for reliable perception.'),
          q('HD Maps', 'hd-maps', 'Medium', 'HD (High Definition) maps used in autonomous vehicles contain:', [o('Only road color information', false), o('Centimeter-precise lane geometry, signs, and semantic attributes', true), o('Only GPS coordinates', false), o('Only traffic information', false)], 'HD maps provide precise geometric and semantic information for autonomous driving.'),
          q('Prediction Module', 'prediction-module', 'Medium', 'The prediction module in autonomous driving:', [o('Plans the vehicle\'s own path', false), o('Forecasts future trajectories of other vehicles and pedestrians', true), o('Controls the vehicle actuators', false), o('Processes raw sensor data', false)], 'Prediction models anticipate how other agents will move in the near future.'),
          q('Planning in AV', 'av-planning', 'Medium', 'Motion planning in autonomous vehicles:', [o('Only controls steering', false), o('Generates safe, comfortable trajectories from current state to goal', true), o('Only processes LiDAR data', false), o('Only handles emergency braking', false)], 'Motion planning generates feasible, optimal trajectories respecting constraints.'),
          q('Localization AV', 'av-localization', 'Hard', 'Localization in autonomous vehicles determines:', [o('The vehicle\'s manufacturing location', false), o('The vehicle\'s precise position and orientation in the map', true), o('The destination location', false), o('The nearest charging station', false)], 'Localization matches sensor observations to HD maps for precise positioning.'),
          q('Drone Navigation', 'drone-navigation', 'Medium', 'AI-powered drone navigation typically uses:', [o('Only GPS for all navigation', false), o('Computer vision, IMU sensors, and AI for obstacle avoidance', true), o('Only human remote control', false), o('Only predefined waypoints', false)], 'Drones combine vision, sensors, and AI for autonomous flight and navigation.'),
          q('Swarm Robotics', 'swarm-robotics', 'Hard', 'Swarm robotics uses:', [o('A single powerful centralized robot', false), o('Large numbers of simple robots with local interactions for collective behavior', true), o('Cloud-controlled robot armies', false), o('Military-grade robotic units', false)], 'Swarm robotics: emergent collective behavior from many simple local interactions.'),
          q('Safety Driver', 'safety-driver', 'Easy', 'A safety driver in autonomous vehicle testing:', [o('Drives the vehicle manually at all times', false), o('Monitors and can take control if the autonomous system fails', true), o('Programs the AI system remotely', false), o('Only rides as a passenger', false)], 'Safety drivers monitor test vehicles and intervene if the autonomous system encounters issues.'),
          q('End-to-End AV', 'end-to-end-av', 'Hard', 'End-to-end learning for autonomous driving:', [o('Learns separate modules for each task', false), o('Directly maps raw sensor inputs to control commands with one network', true), o('Only handles traffic sign recognition', false), o('Requires explicit rule programming', false)], 'End-to-end AV learning: raw pixel/sensor input → steering/acceleration output.'),
        ]
      },
      {
        title: 'AI in Healthcare', slug: 'ai-healthcare', questions: [
          q('Medical Imaging AI', 'medical-imaging-ai', 'Easy', 'AI in medical imaging is primarily used for:', [o('Hospital administration tasks', false), o('Detecting diseases in X-rays, MRIs, and CT scans', true), o('Billing and insurance processing', false), o('Patient scheduling only', false)], 'AI analyzes medical images for disease detection, segmentation, and diagnosis.'),
          q('Drug Discovery AI', 'drug-discovery', 'Medium', 'AI accelerates drug discovery by:', [o('Manufacturing drugs physically', false), o('Predicting drug-protein interactions and molecular properties', true), o('Only packaging drugs', false), o('Marketing pharmaceutical products', false)], 'AI predicts which molecular candidates may be effective drugs, speeding discovery.'),
          q('AlphaFold', 'alphafold-def', 'Easy', 'AlphaFold by DeepMind solved:', [o('The chess grandmaster problem', false), o('Predicting 3D protein structures from amino acid sequences', true), o('Drug manufacturing', false), o('Hospital scheduling optimization', false)], 'AlphaFold solved the 50-year-old protein structure prediction problem.'),
          q('Clinical NLP', 'clinical-nlp', 'Medium', 'NLP in healthcare is used for:', [o('Physical therapy exercises', false), o('Extracting structured information from clinical notes and records', true), o('Surgical procedures', false), o('Medical equipment calibration', false)], 'Clinical NLP extracts diagnoses, medications, and findings from unstructured text.'),
          q('Remote Monitoring', 'remote-monitoring-ai', 'Medium', 'AI-powered remote patient monitoring uses:', [o('In-person doctor visits only', false), o('Wearables and sensors with AI to track patient health continuously', true), o('Only blood tests', false), o('Only hospital admission data', false)], 'AI analyzes continuous sensor data from wearables for early warning detection.'),
          q('Radiology AI', 'radiology-ai', 'Medium', 'AI in radiology primarily assists by:', [o('Replacing radiologists entirely', false), o('Detecting anomalies and flagging findings for radiologist review', true), o('Operating imaging machines', false), o('Only scheduling imaging appointments', false)], 'AI assists radiologists by detecting and highlighting potential findings.'),
          q('Genomics AI', 'genomics-ai', 'Hard', 'AI in genomics is used for:', [o('Physical DNA sequencing hardware', false), o('Analyzing genetic variants to predict disease risk and treatment response', true), o('Manufacturing genetic drugs', false), o('Hospital management only', false)], 'AI analyzes genomic data for precision medicine and genetic disease prediction.'),
          q('FDA AI Clearance', 'fda-ai', 'Medium', 'FDA clearance of AI medical devices requires:', [o('No special requirements', false), o('Demonstrating safety and efficacy through rigorous clinical evidence', true), o('Only a software code review', false), o('Only a manufacturing audit', false)], 'AI medical devices undergo FDA review for safety, efficacy, and regulatory compliance.'),
          q('EHR AI', 'ehr-ai', 'Easy', 'AI applied to Electronic Health Records (EHR) helps:', [o('Only storing patient files', false), o('Predicting patient outcomes, readmission risk, and treatment suggestions', true), o('Only billing and insurance', false), o('Only appointment scheduling', false)], 'AI mines EHR data for clinical decision support and outcome prediction.'),
          q('Surgical AI', 'surgical-ai', 'Hard', 'AI-assisted robotic surgery systems like da Vinci:', [o('Operate fully autonomously without surgeon input', false), o('Enhance surgeon precision with robotic assistance and tremor filtering', true), o('Replace surgeons entirely', false), o('Only monitor patient vital signs', false)], 'Robotic surgery enhances human surgeon precision — AI assists rather than replaces.'),
        ]
      },
      {
        title: 'AI Ethics in Practice', slug: 'ai-ethics-practice', questions: [
          q('Algorithmic Bias', 'algorithmic-bias', 'Medium', 'Algorithmic bias in deployed AI systems is often caused by:', [o('Using Python instead of R', false), o('Biased historical data reflecting societal inequalities', true), o('Using too many model parameters', false), o('Fast inference hardware', false)], 'AI systems perpetuate and amplify biases present in historical training data.'),
          q('Fairness Metrics', 'fairness-metrics', 'Hard', 'Demographic parity in AI fairness means:', [o('All users get exactly identical predictions', false), o('The model outputs positive predictions at equal rates across demographic groups', true), o('Only one demographic group uses the system', false), o('Model accuracy is equal for all groups', false)], 'Demographic parity: P(Ŷ=1|A=a) = P(Ŷ=1|A=b) across demographic groups.'),
          q('Responsible AI', 'responsible-ai', 'Easy', 'Responsible AI principles typically include:', [o('Maximizing profit above all else', false), o('Fairness, transparency, accountability, and privacy protection', true), o('Keeping all AI systems secret', false), o('Deploying AI without human oversight', false)], 'Responsible AI: fairness, transparency, accountability, privacy, and safety.'),
          q('AI Regulation', 'ai-regulation', 'Medium', 'The EU AI Act classifies AI systems by:', [o('Their commercial price', false), o('Risk level — from minimal risk to unacceptable risk', true), o('Country of origin', false), o('Number of model parameters', false)], 'EU AI Act uses a risk-based framework with tiers from minimal to prohibited AI use.'),
          q('Privacy-Preserving AI', 'privacy-preserving', 'Hard', 'Differential privacy in AI:', [o('Prevents all data access', false), o('Provides mathematical privacy guarantees by adding calibrated noise to data or outputs', true), o('Only encrypts model weights', false), o('Only applies to image data', false)], 'Differential privacy limits information leakage about individuals in training data.'),
          q('AI Transparency', 'ai-transparency', 'Medium', 'Model transparency in AI refers to:', [o('Making models run faster', false), o('The degree to which AI decisions can be understood and explained', true), o('Publishing model source code only', false), o('Only disclosing training data', false)], 'Transparency enables stakeholders to understand how and why AI makes decisions.'),
          q('Human in the Loop', 'human-in-loop', 'Medium', '"Human-in-the-loop" AI systems:', [o('Operate fully without any human involvement', false), o('Include human oversight, review, or intervention in the decision process', true), o('Only involve humans for data labeling', false), o('Are slower than fully automated systems always', false)], 'HITL keeps humans actively involved in high-stakes AI decisions.'),
          q('AI Audit', 'ai-audit', 'Hard', 'AI auditing involves:', [o('Checking financial records of AI companies', false), o('Systematically evaluating AI systems for bias, performance, and compliance', true), o('Testing hardware infrastructure only', false), o('Only reviewing AI system code', false)], 'AI audits assess systems for bias, accuracy, fairness, and regulatory compliance.'),
          q('Carbon Footprint AI', 'carbon-ai', 'Medium', 'Large AI models have raised environmental concerns because:', [o('They run on solar power', false), o('Training requires massive energy consumption, producing significant CO2', true), o('They reduce energy consumption', false), o('They only run on mobile devices', false)], 'Training large models like GPT-3 consumes energy equivalent to hundreds of car trips.'),
          q('AI Governance', 'ai-governance-practice', 'Medium', 'AI governance frameworks aim to:', [o('Maximize AI deployment speed at all costs', false), o('Ensure AI is developed and used responsibly, safely, and ethically', true), o('Restrict all AI research entirely', false), o('Only manage AI vendor contracts', false)], 'AI governance creates policies, standards, and oversight for responsible AI use.'),
        ]
      },
      {
        title: 'AI in Business & Industry', slug: 'ai-in-industry', questions: [
          q('Industry 4.0', 'industry-40', 'Medium', 'AI in Industry 4.0 enables:', [o('Manual factory processes only', false), o('Smart automation, predictive maintenance, and quality control in manufacturing', true), o('Paper-based record keeping', false), o('Only warehouse storage management', false)], 'Industry 4.0 combines AI, IoT, and automation for smart manufacturing.'),
          q('Predictive Maintenance', 'predictive-maintenance', 'Easy', 'Predictive maintenance AI:', [o('Fixes equipment manually after failure', false), o('Predicts equipment failures before they occur using sensor data', true), o('Schedules maintenance on fixed calendar intervals', false), o('Only monitors temperature sensors', false)], 'AI predicts equipment failures to enable proactive maintenance, reducing downtime.'),
          q('Recommendation Engine', 'recommendation-engine', 'Easy', 'Collaborative filtering in recommendation systems:', [o('Recommends based on item content features only', false), o('Recommends based on preferences of users with similar tastes', true), o('Uses only explicit user ratings', false), o('Only recommends new items', false)], 'Collaborative filtering finds similar users and recommends what they liked.'),
          q('Fraud Detection', 'fraud-detection-industry', 'Easy', 'AI fraud detection systems work by:', [o('Manually reviewing all transactions', false), o('Learning normal transaction patterns and flagging anomalies in real-time', true), o('Blocking all foreign transactions', false), o('Only checking against blacklists', false)], 'AI learns normal behavior patterns and detects unusual transactions as potential fraud.'),
          q('Supply Chain AI', 'supply-chain-ai', 'Medium', 'AI in supply chain management is used for:', [o('Manual inventory counting only', false), o('Demand forecasting, route optimization, and inventory management', true), o('Only transportation booking', false), o('Only warehouse design', false)], 'AI optimizes supply chains through demand forecasting and logistics optimization.'),
          q('Customer Service AI', 'customer-service-ai', 'Easy', 'AI chatbots in customer service:', [o('Always require human agent handoff', false), o('Handle routine queries automatically 24/7 at scale', true), o('Only work for technical products', false), o('Only send predefined messages', false)], 'AI chatbots resolve common queries autonomously, escalating complex ones to humans.'),
          q('Financial AI', 'financial-ai-apps', 'Medium', 'AI in quantitative finance is used for:', [o('Only ATM cash management', false), o('Algorithmic trading, risk modeling, and portfolio optimization', true), o('Only foreign currency exchange', false), o('Only loan application forms', false)], 'AI powers high-frequency trading, credit scoring, and risk management.'),
          q('Content Moderation', 'content-moderation-ai', 'Medium', 'AI content moderation on social platforms:', [o('Only detects spam messages', false), o('Automatically detects and removes harmful content at massive scale', true), o('Only works for text content', false), o('Requires manual review of every post', false)], 'AI enables platforms to moderate billions of posts for policy violations at scale.'),
          q('AI in Legal', 'ai-legal', 'Medium', 'AI in the legal industry is used for:', [o('Replacing judges entirely', false), o('Contract review, legal research, and document analysis', true), o('Only court scheduling', false), o('Only billing calculations', false)], 'AI assists lawyers with document review, contract analysis, and legal research.'),
          q('ROI of AI', 'roi-ai', 'Medium', 'A key challenge in demonstrating AI ROI in business is:', [o('AI is always unprofitable', false), o('Quantifying intangible benefits and attributing business outcomes to AI', true), o('AI is too expensive to implement', false), o('Businesses do not use AI', false)], 'Measuring AI ROI requires linking model performance metrics to business KPIs.'),
        ]
      },
    ]
  },
];

async function seedExtra() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(DB_URL);
  console.log('Connected');

  const path = await PracticePath.findOne({ slug: 'artificial-intelligence' });
  if (!path) {
    console.error('AI Practice Path not found! Run seedAIFull.js first.');
    process.exit(1);
  }

  const existingTopicCount = await PracticeTopic.countDocuments({ practicePath: path._id });
  console.log(`Existing topics: ${existingTopicCount}`);

  let totalTopics = 0;
  let totalSubtopics = 0;
  let totalQuestions = 0;

  for (let ti = 0; ti < EXTRA_TOPICS.length; ti++) {
    const t = EXTRA_TOPICS[ti];

    // Skip if topic already exists
    const existingTopic = await PracticeTopic.findOne({ slug: t.slug, practicePath: path._id });
    if (existingTopic) {
      console.log(`Topic already exists, skipping: ${t.title}`);
      continue;
    }

    const topic = await PracticeTopic.create({
      practicePath: path._id,
      title: t.title,
      slug: t.slug,
      description: t.description,
      order: existingTopicCount + ti + 1,
      isPublished: true,
    });
    totalTopics++;
    console.log(`Topic ${existingTopicCount + ti + 1}: ${topic.title}`);

    for (let si = 0; si < t.subtopics.length; si++) {
      const s = t.subtopics[si];
      const subtopic = await PracticeSubtopic.create({
        topic: topic._id,
        practicePath: path._id,
        title: s.title,
        slug: t.slug + '-' + s.slug,
        description: 'Practice questions for: ' + s.title,
        order: si + 1,
        isPublished: true,
      });
      totalSubtopics++;

      for (let qi = 0; qi < s.questions.length; qi++) {
        const q2 = s.questions[qi];
        await PracticeQuestion.create({
          practicePath: path._id,
          topic: topic._id,
          subtopic: subtopic._id,
          title: q2.title,
          slug: t.slug + '-' + q2.slug,
          difficulty: q2.difficulty,
          type: 'mcq',
          statement: q2.statement,
          options: q2.options,
          explanation: q2.explanation,
          order: qi + 1,
          isPublished: true,
          tags: ['ai', 'ai-full-seed'],
        });
        totalQuestions++;
      }
      console.log(`  Subtopic ${si + 1}: ${s.title} — ${s.questions.length} questions`);
    }
  }

  const finalTopicCount = await PracticeTopic.countDocuments({ practicePath: path._id });
  const finalQCount = await PracticeQuestion.countDocuments({ practicePath: path._id });

  console.log('\n=== Extra Seed Complete ===');
  console.log(`New Topics Added: ${totalTopics}`);
  console.log(`New Subtopics Added: ${totalSubtopics}`);
  console.log(`New Questions Added: ${totalQuestions}`);
  console.log(`Total Topics in Path: ${finalTopicCount}`);
  console.log(`Total Questions in Path: ${finalQCount}`);
  await mongoose.disconnect();
}

seedExtra().catch(err => {
  console.error('Seed failed:', err);
  process.exit(1);
});
