<?php

namespace App\Modules\ProductManagement\Domain\Entities;

use Carbon\CarbonImmutable;

class ProductVariation
{
    private ?int $id = null;

    private ?CarbonImmutable $createdAt = null;

    private ?CarbonImmutable $updatedAt = null;

    private ?string $corNome = null;

    private ?string $corCodRgb = null;

    /** @var array<int> */
    private array $fotoIds = [];

    public function __construct(
        private int $produtoId,
        private bool $active = true,
        private int $quantidadeEstoque = 0,
        private ?int $corId = null,
        private ?string $tamanhoRoupaAdulto = null,
        private ?string $tamanhoRoupaCrianca = null,
        private ?string $tamanhoCalcado = null,
        private ?string $sku = null,
        private ?string $precoVenda = null,
        private ?string $precoPromocional = null,
        private ?string $custo = null,
    ) {}

    public function getId(): ?int
    {
        return $this->id;
    }

    public function setId(int $id): void
    {
        $this->id = $id;
    }

    public function getProdutoId(): int
    {
        return $this->produtoId;
    }

    public function setProdutoId(int $produtoId): void
    {
        $this->produtoId = $produtoId;
    }

    public function isActive(): bool
    {
        return $this->active;
    }

    public function setActive(bool $active): void
    {
        $this->active = $active;
    }

    public function getQuantidadeEstoque(): int
    {
        return $this->quantidadeEstoque;
    }

    public function setQuantidadeEstoque(int $quantidadeEstoque): void
    {
        $this->quantidadeEstoque = $quantidadeEstoque;
    }

    public function getCorId(): ?int
    {
        return $this->corId;
    }

    public function setCorId(?int $corId): void
    {
        $this->corId = $corId;
    }

    public function getTamanhoRoupaAdulto(): ?string
    {
        return $this->tamanhoRoupaAdulto;
    }

    public function setTamanhoRoupaAdulto(?string $tamanhoRoupaAdulto): void
    {
        $this->tamanhoRoupaAdulto = $tamanhoRoupaAdulto;
    }

    public function getTamanhoRoupaCrianca(): ?string
    {
        return $this->tamanhoRoupaCrianca;
    }

    public function setTamanhoRoupaCrianca(?string $tamanhoRoupaCrianca): void
    {
        $this->tamanhoRoupaCrianca = $tamanhoRoupaCrianca;
    }

    public function getTamanhoCalcado(): ?string
    {
        return $this->tamanhoCalcado;
    }

    public function setTamanhoCalcado(?string $tamanhoCalcado): void
    {
        $this->tamanhoCalcado = $tamanhoCalcado;
    }

    public function getSku(): ?string
    {
        return $this->sku;
    }

    public function setSku(?string $sku): void
    {
        $this->sku = $sku;
    }

    public function getPrecoVenda(): ?string
    {
        return $this->precoVenda;
    }

    public function setPrecoVenda(?string $precoVenda): void
    {
        $this->precoVenda = $precoVenda;
    }

    public function getPrecoPromocional(): ?string
    {
        return $this->precoPromocional;
    }

    public function setPrecoPromocional(?string $precoPromocional): void
    {
        $this->precoPromocional = $precoPromocional;
    }

    public function getCusto(): ?string
    {
        return $this->custo;
    }

    public function setCusto(?string $custo): void
    {
        $this->custo = $custo;
    }

    public function getCorNome(): ?string
    {
        return $this->corNome;
    }

    public function setCorNome(?string $corNome): void
    {
        $this->corNome = $corNome;
    }

    public function getCorCodRgb(): ?string
    {
        return $this->corCodRgb;
    }

    public function setCorCodRgb(?string $corCodRgb): void
    {
        $this->corCodRgb = $corCodRgb;
    }

    public function getCreatedAt(): ?CarbonImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(CarbonImmutable $createdAt): void
    {
        $this->createdAt = $createdAt;
    }

    public function getUpdatedAt(): ?CarbonImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(CarbonImmutable $updatedAt): void
    {
        $this->updatedAt = $updatedAt;
    }

    /** @return array<int> */
    public function getFotoIds(): array
    {
        return $this->fotoIds;
    }

    /** @param array<int> $fotoIds */
    public function setFotoIds(array $fotoIds): void
    {
        $this->fotoIds = $fotoIds;
    }
}
