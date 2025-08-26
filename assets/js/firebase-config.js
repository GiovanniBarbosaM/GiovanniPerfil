// ===== CONFIGURAÇÃO DO FIREBASE =====

// IMPORTANTE: Substitua pelas suas chaves do Firebase Console
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto-id",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456789",
    measurementId: "G-ABCDEFGHIJ"
};

// Inicializar Firebase
let db, storage, analytics;

try {
    // Inicializar Firebase App
    firebase.initializeApp(firebaseConfig);
    
    // Inicializar serviços
    db = firebase.firestore();
    storage = firebase.storage();
    
    // Configurar Analytics (se disponível)
    if (typeof firebase.analytics === 'function') {
        analytics = firebase.analytics();
        console.log('✅ Firebase Analytics inicializado');
    }
    
    // Configurações do Firestore
    configurarFirestore();
    
    console.log('✅ Firebase inicializado com sucesso');
    
} catch (error) {
    console.error('❌ Erro ao inicializar Firebase:', error);
    
    // Fallback para dados locais se Firebase falhar
    usarDadosLocais();
}

// ===== CONFIGURAÇÕES DO FIRESTORE =====
function configurarFirestore() {
    if (!db) return;
    
    // Configurar cache offline
    db.enablePersistence({ synchronizeTabs: true })
        .then(() => {
            console.log('✅ Cache offline habilitado');
        })
        .catch((err) => {
            if (err.code === 'failed-precondition') {
                console.warn('⚠️ Cache offline falhou: múltiplas abas abertas');
            } else if (err.code === 'unimplemented') {
                console.warn('⚠️ Cache offline não suportado neste navegador');
            }
        });
}

// ===== COLEÇÕES DO FIRESTORE =====
const collections = {
    projetos: 'projetos',
    certificados: 'certificados',
    galeria: 'galeria',
    contatos: 'contatos',
    visitas: 'visitas',
    configuracoes: 'configuracoes'
};

// ===== FUNÇÕES DE DADOS - PROJETOS =====
async function carregarProjetos() {
    try {
        if (!db) return await carregarProjetosLocal();
        
        const snapshot = await db.collection(collections.projetos)
            .orderBy('ordem', 'asc')
            .where('ativo', '==', true)
            .get();
        
        const projetos = [];
        snapshot.forEach(doc => {
            projetos.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log('✅ Projetos carregados do Firebase:', projetos.length);
        return projetos;
        
    } catch (error) {
        console.error('❌ Erro ao carregar projetos:', error);
        return await carregarProjetosLocal();
    }
}

async function salvarProjeto(projeto) {
    try {
        if (!db) throw new Error('Firebase não inicializado');
        
        const docRef = await db.collection(collections.projetos).add({
            ...projeto,
            dataCriacao: firebase.firestore.FieldValue.serverTimestamp(),
            dataAtualizacao: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('✅ Projeto salvo:', docRef.id);
        return docRef.id;
        
    } catch (error) {
        console.error('❌ Erro ao salvar projeto:', error);
        throw error;
    }
}

async function atualizarProjeto(id, dados) {
    try {
        if (!db) throw new Error('Firebase não inicializado');
        
        await db.collection(collections.projetos).doc(id).update({
            ...dados,
            dataAtualizacao: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('✅ Projeto atualizado:', id);
        
    } catch (error) {
        console.error('❌ Erro ao atualizar projeto:', error);
        throw error;
    }
}

async function excluirProjeto(id) {
    try {
        if (!db) throw new Error('Firebase não inicializado');
        
        // Soft delete - apenas marca como inativo
        await db.collection(collections.projetos).doc(id).update({
            ativo: false,
            dataExclusao: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        console.log('✅ Projeto excluído:', id);
        
    } catch (error) {
        console.error('❌ Erro ao excluir projeto:', error);
        throw error;
    }
}

// ===== FUNÇÕES DE DADOS - CERTIFICADOS =====
async function carregarCertificados() {
    try {
        if (!db) return await carregarCertificadosLocal();
        
        const snapshot = await db.collection(collections.certificados)
            .orderBy('dataEmissao', 'desc')
            .where('ativo', '==', true)
            .get();
        
        const certificados = [];
        snapshot.forEach(doc => {
            certificados.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log('✅ Certificados carregados do Firebase:', certificados.length);
        return certificados;
        
    } catch (error) {
        console.error('❌ Erro ao carregar certificados:', error);
        return await carregarCertificadosLocal();
    }
}

async function salvarCertificado(certificado) {
    try {
        if (!db) throw new Error('Firebase não inicializado');
        
        const docRef = await db.collection(collections.certificados).add({
            ...certificado,
            dataCriacao: firebase.firestore.FieldValue.serverTimestamp(),
            ativo: true
        });
        
        console.log('✅ Certificado salvo:', docRef.id);
        return docRef.id;
        
    } catch (error) {
        console.error('❌ Erro ao salvar certificado:', error);
        throw error;
    }
}

// ===== FUNÇÕES DE DADOS - GALERIA =====
async function carregarGaleria() {
    try {
        if (!db) return await carregarGaleriaLocal();
        
        const snapshot = await db.collection(collections.galeria)
            .orderBy('dataUpload', 'desc')
            .where('ativo', '==', true)
            .get();
        
        const fotos = [];
        snapshot.forEach(doc => {
            fotos.push({
                id: doc.id,
                ...doc.data()
            });
        });
        
        console.log('✅ Galeria carregada do Firebase:', fotos.length);
        return fotos;
        
    } catch (error) {
        console.error('❌ Erro ao carregar galeria:', error);
        return await carregarGaleriaLocal();
    }
}

async function uploadImagem(arquivo, pasta = 'galeria') {
    try {
        if (!storage) throw new Error('Firebase Storage não inicializado');
        
        const timestamp = Date.now();
        const nomeArquivo = `${pasta}/${timestamp}_${arquivo.name}`;
        
        const uploadTask = storage.ref().child(nomeArquivo).put(arquivo);
        
        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progresso = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(`📤 Upload: ${Math.round(progresso)}%`);
                },
                (error) => {
                    console.error('❌ Erro no upload:', error);
                    reject(error);
                },
                async () => {
                    try {
                        const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
                        console.log('✅ Upload concluído:', downloadURL);
                        resolve({
                            url: downloadURL,
                            nome: nomeArquivo,
                            tamanho: arquivo.size
                        });
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
        
    } catch (error) {
        console.error('❌ Erro ao fazer upload:', error);
        throw error;
    }
}

// ===== FUNÇÕES DE DADOS - CONTATOS =====
async function salvarContato(dadosContato) {
    try {
        if (!db) {
            console.warn('Firebase não disponível, salvando localmente');
            return salvarContatoLocal(dadosContato);
        }
        
        const docRef = await db.collection(collections.contatos).add({
            ...dadosContato,
            dataEnvio: firebase.firestore.FieldValue.serverTimestamp(),
            status: 'novo',
            lido: false
        });
        
        console.log('✅ Contato salvo:', docRef.id);
        
        // Registrar analytics
        if (analytics) {
            analytics.logEvent('contact_form_submit', {
                form_name: 'contact_page'
            });
        }
        
        return docRef.id;
        
    } catch (error) {
        console.error('❌ Erro ao salvar contato:', error);
        throw error;
    }
}

// ===== FUNÇÕES DE ANALYTICS =====
async function registrarVisita() {
    try {
        if (!db) return;
        
        const dadosVisita = {
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            pagina: window.location.pathname,
            userAgent: navigator.userAgent,
            idioma: navigator.language,
            resolucao: `${screen.width}x${screen.height}`,
            referrer: document.referrer || 'direto'
        };
        
        await db.collection(collections.visitas).add(dadosVisita);
        console.log('✅ Visita registrada');
        
    } catch (error) {
        console.error('❌ Erro ao registrar visita:', error);
    }
}

// ===== FUNÇÕES DE CONFIGURAÇÃO =====
async function carregarConfiguracoes() {
    try {
        if (!db) return await carregarConfiguracoesLocal();
        
        const doc = await db.collection(collections.configuracoes)
            .doc('geral')
            .get();
        
        if (doc.exists) {
            return doc.data();
        } else {
            return await criarConfiguracoesDefault();
        }
        
    } catch (error) {
        console.error('❌ Erro ao carregar configurações:', error);
        return await carregarConfiguracoesLocal();
    }
}

async function criarConfiguracoesDefault() {
    const configDefault = {
        nome: 'Giovanni Barbosa',
        profissao: 'Desenvolvedor Full-Stack & Designer',
        bio: 'Transformo ideias em experiências digitais incríveis.',
        email: 'contato@giovannibarbosa.com',
        telefone: '+55 (11) 99999-9999',
        localizacao: 'São Paulo, Brasil',
        redesSociais: {
            linkedin: 'https://linkedin.com/in/giovannibarbosa',
            github: 'https://github.com/giovannibarbosa',
            instagram: 'https://instagram.com/giovannibarbosa',
            whatsapp: 'https://wa.me/5511999999999'
        },
        skills: [
            'JavaScript', 'React', 'Node.js', 'Python', 'Firebase',
            'HTML5', 'CSS3', 'UI/UX Design', 'Git', 'PostgreSQL'
        ],
        dataAtualizacao: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    try {
        if (db) {
            await db.collection(collections.configuracoes)
                .doc('geral')
                .set(configDefault);
        }
        return configDefault;
    } catch (error) {
        console.error('❌ Erro ao criar configurações:', error);
        return configDefault;
    }
}

// ===== FALLBACK PARA DADOS LOCAIS =====
function usarDadosLocais() {
    console.warn('⚠️ Usando dados locais como fallback');
    
    // Implementar dados mock se Firebase não estiver disponível
    window.DADOS_LOCAL = true;
}

async function carregarProjetosLocal() {
    // Dados de exemplo para desenvolvimento
    return [
        {
            id: 'projeto-1',
            titulo: 'E-commerce Moderno',
            descricao: 'Plataforma completa de vendas online com React e Node.js',
            tecnologias: ['React', 'Node.js', 'MongoDB', 'Stripe'],
            imagem: './assets/images/projetos/ecommerce.jpg',
            url: 'https://exemplo.com',
            github: 'https://github.com/giovannibarbosa/ecommerce',
            categoria: 'web',
            destaque: true,
            ativo: true
        },
        {
            id: 'projeto-2',
            titulo: 'App Mobile de Tarefas',
            descricao: 'Aplicativo de produtividade com React Native',
            tecnologias: ['React Native', 'Firebase', 'Redux'],
            imagem: './assets/images/projetos/app-tarefas.jpg',
            url: 'https://play.google.com/store',
            github: 'https://github.com/giovannibarbosa/app-tarefas',
            categoria: 'mobile',
            destaque: false,
            ativo: true
        }
    ];
}

async function carregarCertificadosLocal() {
    return [
        {
            id: 'cert-1',
            titulo: 'Certificado React Developer',
            instituicao: 'Meta',
            dataEmissao: '2024-01-15',
            imagem: './assets/images/certificados/react-meta.jpg',
            url: 'https://certificado.exemplo.com',
            categoria: 'frontend',
            ativo: true
        }
    ];
}

async function carregarGaleriaLocal() {
    return [
        {
            id: 'foto-1',
            titulo: 'Workspace Setup',
            imagem: './assets/images/galeria/setup.jpg',
            categoria: 'workspace',
            ativo: true
        }
    ];
}

async function carregarConfiguracoesLocal() {
    return {
        nome: 'Giovanni Barbosa',
        profissao: 'Desenvolvedor Full-Stack & Designer',
        email: 'contato@giovannibarbosa.com',
        telefone: '+55 (11) 99999-9999'
    };
}

function salvarContatoLocal(dados) {
    console.log('💾 Salvando contato localmente:', dados);
    // Em produção, você pode implementar EmailJS ou outro serviço
    return Promise.resolve('local-' + Date.now());
}

// ===== INICIALIZAÇÃO AUTOMÁTICA =====
document.addEventListener('DOMContentLoaded', () => {
    registrarVisita();
});

// ===== EXPORTAR PARA USO GLOBAL =====
window.FirebaseAPI = {
    // Projetos
    carregarProjetos,
    salvarProjeto,
    atualizarProjeto,
    excluirProjeto,
    
    // Certificados
    carregarCertificados,
    salvarCertificado,
    
    // Galeria
    carregarGaleria,
    uploadImagem,
    
    // Contatos
    salvarContato,
    
    // Configurações
    carregarConfiguracoes,
    
    // Analytics
    registrarVisita,
    
    // Firebase instances
    db,
    storage,
    analytics
};